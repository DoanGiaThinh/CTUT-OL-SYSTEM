# Forward script cho Render Build Command khi chạy python init_db.py từ thư mục gốc
from backend.init_db import create_tables

if __name__ == "__main__":
    create_tables()
