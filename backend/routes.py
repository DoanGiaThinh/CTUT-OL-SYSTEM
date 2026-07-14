from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from external_api import search_all_external

router = APIRouter()

# ============ Helper Lấy User Mặc định / Demo ============
def get_current_user_or_demo(user_id: Optional[int] = None, db: Session = Depends(get_db)) -> models.User:
    if user_id:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user:
            return user
    # Lấy demo user đầu tiên nếu không truyền user_id
    user = db.query(models.User).first()
    if not user:
        user = models.User(
            email="sinhvien@ctut.edu.vn",
            full_name="Đoàn Gia Thịnh (Sinh viên CTUT)",
            role="student"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


# =========================================================================
# 1. API KHO TÀI LIỆU NỘI BỘ (Documents)
# =========================================================================

@router.get("/documents", response_model=List[schemas.DocumentOut])
def list_documents(
    query: Optional[str] = None,
    category: Optional[str] = None,
    open_access_only: Optional[bool] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tài liệu nội bộ (hỗ trợ lọc từ khóa, thể loại, trạng thái Open Access).
    """
    q = db.query(models.Document)
    if query:
        q = q.filter(
            models.Document.title.ilike(f"%{query}%") |
            models.Document.authors.ilike(f"%{query}%") |
            models.Document.category.ilike(f"%{query}%")
        )
    if category and category != "Tất cả":
        q = q.filter(models.Document.category == category)
    if open_access_only is not None:
        q = q.filter(models.Document.is_open_access == open_access_only)

    documents = q.order_by(models.Document.id.desc()).all()

    current_user = get_current_user_or_demo(user_id, db)
    # Lấy danh sách mượn hiện tại của user
    user_borrows = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.user_id == current_user.id,
        models.BorrowRecord.status.in_(["borrowing", "overdue"])
    ).all()
    borrow_map = {b.document_id: b for b in user_borrows}

    out_list = []
    for doc in documents:
        doc_out = schemas.DocumentOut.model_validate(doc)
        if doc.id in borrow_map:
            b = borrow_map[doc.id]
            doc_out.current_user_borrow_status = b.status
            doc_out.current_user_borrow_id = b.id
            doc_out.due_date = b.due_date
        out_list.append(doc_out)

    return out_list


@router.get("/documents/{id}", response_model=schemas.DocumentOut)
def get_document_detail(
    id: int,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    doc = db.query(models.Document).filter(models.Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài liệu này trong thư viện.")

    current_user = get_current_user_or_demo(user_id, db)
    b = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.user_id == current_user.id,
        models.BorrowRecord.document_id == id,
        models.BorrowRecord.status.in_(["borrowing", "overdue"])
    ).first()

    doc_out = schemas.DocumentOut.model_validate(doc)
    if b:
        doc_out.current_user_borrow_status = b.status
        doc_out.current_user_borrow_id = b.id
        doc_out.due_date = b.due_date

    return doc_out


# =========================================================================
# 2. [QUAN TRỌNG] API ĐỌC TRỰC TUYẾN (READ ONLINE)
# =========================================================================

@router.get("/documents/{id}/read", response_model=schemas.ReadOnlineResponse)
def read_document_online(
    id: int,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Kiểm tra quyền (Open Access hoặc đang trong trạng thái mượn hợp lệ) rồi mới trả về luồng/link đọc PDF.
    """
    doc = db.query(models.Document).filter(models.Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Tài liệu không tồn tại.")

    current_user = get_current_user_or_demo(user_id, db)

    # 1. Nếu là Open Access -> Cho phép đọc ngay
    if doc.is_open_access:
        return schemas.ReadOnlineResponse(
            document_id=doc.id,
            title=doc.title,
            file_path_url=doc.file_path_url,
            access_type="OPEN_ACCESS",
            user_name=current_user.full_name,
            expires_at=None,
            watermark_text=f"Open Digital Library - Open Access - {current_user.full_name}"
        )

    # 2. Nếu là tài liệu bản quyền -> Kiểm tra bản ghi mượn
    borrow_record = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.user_id == current_user.id,
        models.BorrowRecord.document_id == id,
        models.BorrowRecord.status.in_(["borrowing", "overdue"])
    ).first()

    if not borrow_record:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài liệu có bản quyền giới hạn. Bạn cần nhấn 'Mượn sách' trước khi có thể đọc trực tuyến."
        )

    # Kiểm tra hạn mượn
    now = datetime.utcnow()
    if now > borrow_record.due_date:
        borrow_record.status = "overdue"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài liệu đã hết thời hạn mượn (quá hạn). Vui lòng trả sách hoặc làm thủ tục mượn lại để tiếp tục đọc."
        )

    return schemas.ReadOnlineResponse(
        document_id=doc.id,
        title=doc.title,
        file_path_url=doc.file_path_url,
        access_type="BORROWED_VALID",
        user_name=current_user.full_name,
        expires_at=borrow_record.due_date,
        watermark_text=f"Authorized Reader: {current_user.full_name} | Expires: {borrow_record.due_date.strftime('%d/%m/%Y')}"
    )


# =========================================================================
# 3. [QUAN TRỌNG] API MƯỢN / TRẢ TÀI LIỆU SỐ (BORROW & RETURN)
# =========================================================================

@router.post("/borrow", response_model=schemas.BorrowRecordOut)
def borrow_document(payload: schemas.BorrowRequest, db: Session = Depends(get_db)):
    """
    Xử lý logic mượn sách:
    - Kiểm tra available_copies > 0
    - Tạo bản ghi BorrowRecord
    - Giảm available_copies đi 1
    """
    doc = db.query(models.Document).filter(models.Document.id == payload.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Tài liệu không tồn tại.")

    if doc.is_open_access:
        raise HTTPException(
            status_code=400,
            detail="Tài liệu này là Open Access (Mở hoàn toàn), bạn có thể đọc ngay mà không cần mượn."
        )

    current_user = get_current_user_or_demo(payload.user_id, db)

    # Kiểm tra user đã mượn cuốn này chưa trả chưa
    existing_borrow = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.user_id == current_user.id,
        models.BorrowRecord.document_id == doc.id,
        models.BorrowRecord.status.in_(["borrowing", "overdue"])
    ).first()

    if existing_borrow:
        raise HTTPException(
            status_code=400,
            detail="Bạn đang mượn tài liệu này rồi. Vui lòng vào Tủ sách của bạn để đọc trực tuyến."
        )

    # Kiểm tra số lượng bản có sẵn
    if doc.available_copies <= 0:
        raise HTTPException(
            status_code=400,
            detail="Tài liệu hiện đã hết bản mượn đồng thời. Vui lòng quay lại sau khi có người đọc trả sách."
        )

    # Tạo bản ghi BorrowRecord
    now = datetime.utcnow()
    due = now + timedelta(days=7)  # Thời hạn mượn 7 ngày

    new_record = models.BorrowRecord(
        user_id=current_user.id,
        document_id=doc.id,
        borrow_date=now,
        due_date=due,
        status="borrowing"
    )

    # Giảm available_copies đi 1
    doc.available_copies -= 1

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    out = schemas.BorrowRecordOut.model_validate(new_record)
    out.document = schemas.DocumentOut.model_validate(doc)
    out.days_remaining = max(0, (due - now).days)
    return out


@router.post("/return")
def return_document(payload: schemas.ReturnRequest, db: Session = Depends(get_db)):
    """
    Xử lý logic trả sách:
    - Cập nhật return_date, status = 'returned'
    - Tăng lại available_copies += 1
    """
    query = db.query(models.BorrowRecord)

    if payload.borrow_record_id:
        record = query.filter(models.BorrowRecord.id == payload.borrow_record_id).first()
    elif payload.document_id:
        current_user = get_current_user_or_demo(payload.user_id, db)
        record = query.filter(
            models.BorrowRecord.user_id == current_user.id,
            models.BorrowRecord.document_id == payload.document_id,
            models.BorrowRecord.status.in_(["borrowing", "overdue"])
        ).first()
    else:
        raise HTTPException(status_code=400, detail="Vui lòng cung cấp mã lượt mượn hoặc mã tài liệu cần trả.")

    if not record:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin lượt mượn đang hoạt động.")

    if record.status == "returned":
        raise HTTPException(status_code=400, detail="Tài liệu này đã được trả trước đó.")

    doc = db.query(models.Document).filter(models.Document.id == record.document_id).first()

    record.return_date = datetime.utcnow()
    record.status = "returned"

    if doc:
        doc.available_copies = min(doc.total_copies, doc.available_copies + 1)

    db.commit()
    return {
        "success": True,
        "message": f"Đã trả tài liệu '{doc.title if doc else 'Sách số'}' thành công! Cảm ơn bạn đã hoàn trả đúng hạn.",
        "available_copies": doc.available_copies if doc else 0
    }


@router.get("/user/borrowed-list", response_model=List[schemas.BorrowRecordOut])
def get_user_borrowed_list(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Lấy danh sách các sách người dùng hiện đang mượn và số ngày còn lại.
    """
    current_user = get_current_user_or_demo(user_id, db)
    records = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.user_id == current_user.id,
        models.BorrowRecord.status.in_(["borrowing", "overdue"])
    ).order_by(models.BorrowRecord.borrow_date.desc()).all()

    now = datetime.utcnow()
    out_list = []
    for r in records:
        out = schemas.BorrowRecordOut.model_validate(r)
        if r.document:
            out.document = schemas.DocumentOut.model_validate(r.document)
        # Tính days remaining
        remaining = (r.due_date - now).days
        out.days_remaining = max(0, remaining)
        # Cập nhật trạng thái overdue nếu đã hết hạn
        if now > r.due_date and r.status != "overdue":
            r.status = "overdue"
            db.commit()
            out.status = "overdue"
        out_list.append(out)

    return out_list


# =========================================================================
# 4. API TÌM KIẾM HỌC THUẬT MỞ (arXiv, DOAJ, VJOL) & LƯU BÀI BÁO
# =========================================================================

@router.get("/external/search", response_model=List[schemas.ExternalArticleOut])
async def search_academic_external(
    query: str = Query(..., description="Từ khóa tra cứu bài báo/tài liệu học thuật"),
    source: str = Query("all", description="Nguồn: all | arxiv | doaj | vjol"),
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    results = await search_all_external(query, source)
    current_user = get_current_user_or_demo(user_id, db)

    saved_items = db.query(models.SavedArticle).filter(
        models.SavedArticle.user_id == current_user.id
    ).all()
    saved_ids = {item.external_id for item in saved_items}

    out_list = []
    for r in results:
        article = schemas.ExternalArticleOut(**r)
        if article.external_id in saved_ids:
            article.is_saved = True
        out_list.append(article)
    return out_list


@router.post("/saved-articles", response_model=schemas.SavedArticleOut)
def save_academic_article(payload: schemas.SavedArticleCreate, user_id: Optional[int] = None, db: Session = Depends(get_db)):
    current_user = get_current_user_or_demo(user_id, db)
    existing = db.query(models.SavedArticle).filter(
        models.SavedArticle.user_id == current_user.id,
        models.SavedArticle.external_id == payload.external_id
    ).first()

    if existing:
        return schemas.SavedArticleOut.model_validate(existing)

    new_article = models.SavedArticle(
        user_id=current_user.id,
        external_id=payload.external_id,
        source=payload.source,
        title=payload.title,
        authors=payload.authors,
        abstract=payload.abstract,
        pdf_url=payload.pdf_url
    )
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    return schemas.SavedArticleOut.model_validate(new_article)


@router.get("/saved-articles", response_model=List[schemas.SavedArticleOut])
def get_saved_articles(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    current_user = get_current_user_or_demo(user_id, db)
    items = db.query(models.SavedArticle).filter(
        models.SavedArticle.user_id == current_user.id
    ).order_by(models.SavedArticle.saved_at.desc()).all()
    return [schemas.SavedArticleOut.model_validate(item) for item in items]


@router.delete("/saved-articles/{id}")
def delete_saved_article(id: int, user_id: Optional[int] = None, db: Session = Depends(get_db)):
    current_user = get_current_user_or_demo(user_id, db)
    item = db.query(models.SavedArticle).filter(
        models.SavedArticle.id == id,
        models.SavedArticle.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Bài báo đã lưu không tồn tại.")
    db.delete(item)
    db.commit()
    return {"success": True, "message": "Đã xóa bài báo khỏi tủ sách cá nhân."}


# =========================================================================
# 5. API NGƯỜI DÙNG HIỆN TẠI (USER PROFILE)
# =========================================================================
@router.get("/user/me", response_model=schemas.UserOut)
def get_user_profile(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    return get_current_user_or_demo(user_id, db)
