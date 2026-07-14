import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Lấy DATABASE_URL từ biến môi trường (Ví dụ trên Render hoặc file .env)
# Nếu không có, fallback sang file SQLite cục bộ
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./library.db")

# Render đôi khi dùng "postgres://" thay vì "postgresql://", SQLAlchemy 2.0+ yêu cầu "postgresql://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
