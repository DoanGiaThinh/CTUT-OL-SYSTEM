from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ============ User Schemas ============
class UserBase(BaseModel):
    email: str
    full_name: str
    role: Optional[str] = "student"

class UserCreate(UserBase):
    password: Optional[str] = "123456"

class UserOut(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ============ Document Schemas ============
class DocumentBase(BaseModel):
    title: str
    authors: str
    category: Optional[str] = "Khoa học kỹ thuật"
    description: Optional[str] = None
    cover_url: Optional[str] = None
    file_path_url: str
    publication_year: Optional[int] = 2024
    total_copies: Optional[int] = 3
    available_copies: Optional[int] = 3
    is_open_access: Optional[bool] = False

class DocumentCreate(DocumentBase):
    pass

class DocumentOut(DocumentBase):
    id: int
    created_at: datetime
    # Thông tin bổ sung cho user đang truy vấn
    current_user_borrow_status: Optional[str] = None  # None, 'borrowing', 'overdue'
    current_user_borrow_id: Optional[int] = None
    due_date: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


# ============ Read Online Schema ============
class ReadOnlineResponse(BaseModel):
    document_id: int
    title: str
    file_path_url: str
    access_type: str  # 'OPEN_ACCESS' hoặc 'BORROWED_VALID'
    user_name: str
    expires_at: Optional[datetime] = None
    watermark_text: str


# ============ Borrow & Return Schemas ============
class BorrowRequest(BaseModel):
    document_id: int = Field(..., description="ID tài liệu cần mượn")
    user_id: Optional[int] = Field(None, description="ID người dùng mượn (mặc định user hiện tại/demo)")

class ReturnRequest(BaseModel):
    borrow_record_id: Optional[int] = None
    document_id: Optional[int] = None
    user_id: Optional[int] = None

class BorrowRecordOut(BaseModel):
    id: int
    user_id: int
    document_id: int
    borrow_date: datetime
    due_date: datetime
    return_date: Optional[datetime] = None
    status: str
    document: Optional[DocumentOut] = None
    days_remaining: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)


# ============ Saved Article Schemas ============
class SavedArticleCreate(BaseModel):
    external_id: str
    source: str  # 'arXiv', 'DOAJ', 'VJOL', 'Internal'
    title: str
    authors: Optional[str] = ""
    abstract: Optional[str] = ""
    pdf_url: Optional[str] = ""

class SavedArticleOut(SavedArticleCreate):
    id: int
    user_id: int
    saved_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ============ External Academic Search Schema ============
class ExternalArticleOut(BaseModel):
    external_id: str
    source: str  # 'arXiv', 'DOAJ', 'VJOL'
    title: str
    authors: str
    abstract: str
    published_date: Optional[str] = None
    pdf_url: str
    landing_url: Optional[str] = None
    is_saved: Optional[bool] = False
