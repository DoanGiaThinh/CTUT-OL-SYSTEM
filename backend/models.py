from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student")  # 'student', 'lecturer', 'admin'
    hashed_password = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    borrow_records = relationship("BorrowRecord", back_populates="user", cascade="all, delete-orphan")
    saved_articles = relationship("SavedArticle", back_populates="user", cascade="all, delete-orphan")


class Document(Base):
    """
    Bảng Document: Quản lý tài liệu nội bộ của thư viện số.
    - is_open_access = True: Tài liệu mở (Open Access), không giới hạn lượt xem/đọc.
    - is_open_access = False: Tài liệu bản quyền E-book, yêu cầu mượn trước khi xem PDF, quản lý số bản có sẵn (available_copies).
    """
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    authors = Column(String(500), nullable=False)
    category = Column(String(100), default="Khoa học kỹ thuật")
    description = Column(Text, nullable=True)
    cover_url = Column(String(1000), nullable=True)
    file_path_url = Column(String(1000), nullable=False)  # Link PDF / File lưu trữ
    publication_year = Column(Integer, default=2024)
    total_copies = Column(Integer, default=3)
    available_copies = Column(Integer, default=3)
    is_open_access = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    borrow_records = relationship("BorrowRecord", back_populates="document", cascade="all, delete-orphan")


class BorrowRecord(Base):
    """
    Bảng BorrowRecord: Quản lý quy trình mượn / trả tài liệu số.
    status: 'borrowing' (đang mượn), 'returned' (đã trả), 'overdue' (quá hạn)
    """
    __tablename__ = "borrow_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    borrow_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    due_date = Column(DateTime, nullable=False)  # Mặc định +7 ngày từ borrow_date
    return_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="borrowing", index=True)

    user = relationship("User", back_populates="borrow_records")
    document = relationship("Document", back_populates="borrow_records")


class SavedArticle(Base):
    """
    Bảng SavedArticle: Lưu các bài báo học thuật yêu thích từ arXiv, DOAJ, VJOL hoặc tài liệu nội bộ.
    """
    __tablename__ = "saved_articles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    external_id = Column(String(255), nullable=False)
    source = Column(String(50), nullable=False)  # 'arXiv', 'DOAJ', 'VJOL', 'Internal'
    title = Column(String(1000), nullable=False)
    authors = Column(String(1000), nullable=True)
    abstract = Column(Text, nullable=True)
    pdf_url = Column(String(1000), nullable=True)
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_articles")
