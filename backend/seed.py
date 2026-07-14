import sys
import codecs
if sys.stdout.encoding != 'utf-8':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

from datetime import datetime, timedelta, timezone
from database import SessionLocal, engine, Base
import models
from auth import hash_password


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Kiểm tra nếu đã có user thì thôi hoặc bổ sung
        demo_user = db.query(models.User).filter_by(email="sinhvien@ctut.edu.vn").first()
        if not demo_user:
            demo_user = models.User(
                email="sinhvien@ctut.edu.vn",
                full_name="Đoàn Gia Thịnh (Sinh viên CTUT)",
                role="student",
                hashed_password=hash_password("123456")
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            print(f"Đã tạo user mẫu: {demo_user.full_name}")
        elif not demo_user.hashed_password:
            demo_user.hashed_password = hash_password("123456")
            db.commit()
            print(f"Đã cập nhật mật khẩu cho user mẫu: {demo_user.full_name}")
        else:
            print(f"Đã tồn tại user mẫu: {demo_user.full_name}")


        # Tạo tài khoản admin nếu chưa có
        admin_user = db.query(models.User).filter_by(email="admincds@ctut.edu.vn").first()
        if not admin_user:
            admin_user = models.User(
                email="admincds@ctut.edu.vn",
                full_name="Quản trị viên Thư viện Số (CTUT)",
                role="admin",
                hashed_password=hash_password("Admin@CTUT2024")
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print(f"Đã tạo tài khoản admin: {admin_user.email}")
        elif not admin_user.hashed_password:
            admin_user.hashed_password = hash_password("Admin@CTUT2024")
            db.commit()
            print(f"Đã cập nhật mật khẩu cho tài khoản admin: {admin_user.email}")
        else:
            print(f"Đã tồn tại tài khoản admin: {admin_user.email}")


        if db.query(models.Document).count() == 0:
            sample_docs = [
                # ===== TÀI LIỆU MỞ (OPEN ACCESS) - Đọc ngay không giới hạn =====
                models.Document(
                    title="Trí tuệ nhân tạo và Học sâu: Nguyên lý & Ứng dụng thực tiễn",
                    authors="PGS. TS. Nguyễn Văn An, TS. Lê Trọng Tuấn",
                    category="Công nghệ thông tin",
                    description="Giáo trình mở giới thiệu chuyên sâu về mạng nơ-ron nhân tạo, học sâu (Deep Learning), xử lý ngôn ngữ tự nhiên và thị giác máy tính với các ví dụ thực hành trên PyTorch.",
                    cover_url="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
                    file_path_url="https://arxiv.org/pdf/1505.00387.pdf",
                    publication_year=2024,
                    total_copies=999,
                    available_copies=999,
                    is_open_access=True
                ),
                models.Document(
                    title="Kiến trúc hệ thống phân tán và Điện toán đám mây hiện đại",
                    authors="TS. Trần Công Khang",
                    category="Công nghệ thông tin",
                    description="Tài liệu nghiên cứu mở về thiết kế vi dịch vụ (Microservices), hệ thống phân tán, sự đồng thuận (Consensus algorithm) và quản trị Kubernetes trên đám mây.",
                    cover_url="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
                    file_path_url="https://arxiv.org/pdf/1706.03762.pdf",
                    publication_year=2023,
                    total_copies=999,
                    available_copies=999,
                    is_open_access=True
                ),
                models.Document(
                    title="Nền tảng Toán học cho Khoa học Dữ liệu và Thống kê suy diễn",
                    authors="GS. TS. Hoàng Minh Tuấn",
                    category="Toán học & Thống kê",
                    description="Tài liệu Open Access trình bày đại số tuyến tính, xác suất thống kê và phương pháp tối ưu hóa dành cho kỹ sư Khoa học dữ liệu.",
                    cover_url="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
                    file_path_url="https://arxiv.org/pdf/1803.08823.pdf",
                    publication_year=2023,
                    total_copies=999,
                    available_copies=999,
                    is_open_access=True
                ),

                # ===== E-BOOK GIỚI HẠN BẢN QUYỀN (Cần Mượn trước khi Đọc trực tuyến) =====
                models.Document(
                    title="Clean Architecture: Nghệ thuật Kiến trúc Phần mềm và Thiết kế Hệ thống",
                    authors="Robert C. Martin (Bản dịch & Chú giải CTUT)",
                    category="Kỹ thuật phần mềm",
                    description="Cuốn sách kinh điển hướng dẫn xây dựng kiến trúc phần mềm bền vững, khả năng bảo trì cao, tách biệt giao diện và logic cốt lõi. Tài liệu bản quyền giới hạn 3 lượt mượn đồng thời.",
                    cover_url="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
                    file_path_url="https://arxiv.org/pdf/2004.04906.pdf",
                    publication_year=2024,
                    total_copies=3,
                    available_copies=2,  # 1 bản sẽ được gán mượn mẫu
                    is_open_access=False
                ),
                models.Document(
                    title="Thiết kế và Tối ưu hóa Hệ quản trị Cơ sở dữ liệu PostgreSQL Nâng cao",
                    authors="TS. Đinh Quốc Bảo, ThS. Phạm Hoàng Hương",
                    category="Cơ sở dữ liệu",
                    description="Tài liệu chuyên sâu về cơ chế ACID, Query Optimizer, Indexing B-Tree & GIN, Partitioning và Replicas trong PostgreSQL dành cho kiến trúc sư dữ liệu.",
                    cover_url="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
                    file_path_url="https://arxiv.org/pdf/1911.00176.pdf",
                    publication_year=2023,
                    total_copies=3,
                    available_copies=3,
                    is_open_access=False
                ),
                models.Document(
                    title="An toàn thông tin mạng & Mật mã học ứng dụng trong Kỷ nguyên Số",
                    authors="PGS. TS. Vũ Minh Quang",
                    category="An toàn thông tin",
                    description="Hệ thống các phương pháp bảo mật ứng dụng Web, mã hóa bất đối xứng, chữ ký số và phòng chống tấn công mạng trong môi trường Thư viện số.",
                    cover_url="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
                    file_path_url="https://arxiv.org/pdf/2103.00020.pdf",
                    publication_year=2024,
                    total_copies=2,
                    available_copies=0,  # Thử nghiệm trường hợp Hết sách để mượn (0/2)
                    is_open_access=False
                ),
                models.Document(
                    title="Lập trình Full-Stack Web Hiện đại với React, Tailwind CSS và Python FastAPI",
                    authors="ThS. Lê Hoàng Hải",
                    category="Kỹ thuật phần mềm",
                    description="Hướng dẫn thực hành từ A-Z phát triển ứng dụng Web hiệu năng cao với React 18, Tailwind CSS hiện đại và Python FastAPI phi đồng bộ.",
                    cover_url="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                    file_path_url="https://arxiv.org/pdf/2201.00010.pdf",
                    publication_year=2024,
                    total_copies=5,
                    available_copies=5,
                    is_open_access=False
                )
            ]
            db.add_all(sample_docs)
            db.commit()
            print("Đã nạp 7 sách mẫu vào bảng Document (bao gồm Open Access và Limited E-book).")

            # Tạo 1 bản ghi mượn mẫu cho Clean Architecture
            clean_arch = db.query(models.Document).filter_by(title="Clean Architecture: Nghệ thuật Kiến trúc Phần mềm và Thiết kế Hệ thống").first()
            if clean_arch:
                now = datetime.utcnow()
                sample_borrow = models.BorrowRecord(
                    user_id=demo_user.id,
                    document_id=clean_arch.id,
                    borrow_date=now - timedelta(days=2),
                    due_date=now + timedelta(days=5),
                    status="borrowing"
                )
                db.add(sample_borrow)
                db.commit()
                print("Đã tạo lượt mượn mẫu cho tài liệu Clean Architecture.")

    except Exception as e:
        print(f"Lỗi khi nạp dữ liệu mẫu: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
