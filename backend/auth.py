import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import get_db
import models

# ============================================================
# Cấu hình bảo mật
# ============================================================
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "ctut_open_library_super_secret_key_2024_!@#")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)


# ============================================================
# Hàm tiện ích mật khẩu & token
# ============================================================
def hash_password(password: str) -> str:
    """Băm mật khẩu bằng bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Kiểm tra mật khẩu người dùng nhập khớp với mật khẩu đã băm."""
    if not hashed_password:
        return False
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Tạo JWT access token với thông tin user và thời gian hết hạn."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ============================================================
# Dependency: Lấy user hiện tại từ JWT token (tùy chọn)
# ============================================================
def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db)
) -> Optional[models.User]:
    """
    Giải mã token JWT nếu có. Trả về None nếu không có token hoặc token không hợp lệ.
    Dùng cho các endpoint vừa hỗ trợ user đã đăng nhập, vừa cho phép anonymous.
    """
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            return None
        user = db.query(models.User).filter(models.User.id == int(user_id)).first()
        return user
    except jwt.ExpiredSignatureError:
        return None
    except jwt.PyJWTError:
        return None


# ============================================================
# Dependency: Yêu cầu đăng nhập bắt buộc
# ============================================================
def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    """
    Giải mã token JWT. Ném lỗi 401 nếu token thiếu hoặc không hợp lệ.
    Dùng cho các endpoint yêu cầu đăng nhập.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not credentials:
        raise credentials_exception
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        user = db.query(models.User).filter(models.User.id == int(user_id)).first()
        if user is None:
            raise credentials_exception
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token đã hết hạn. Vui lòng đăng nhập lại.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise credentials_exception


# ============================================================
# Dependency: Chỉ dành cho Admin
# ============================================================
def require_admin(current_user: models.User = Depends(get_current_user)) -> models.User:
    """
    Kiểm tra người dùng hiện tại phải có role 'admin'.
    Ném lỗi 403 nếu không đủ quyền.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện thao tác này. Chỉ dành cho Quản trị viên."
        )
    return current_user
