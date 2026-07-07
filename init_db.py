import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Đoạn mã SQL tạo bảng (nếu chưa tồn tại)
CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS Categories (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Databases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS Database_Category (
    db_id INT REFERENCES Databases(id) ON DELETE CASCADE,
    category_id INT REFERENCES Categories(id) ON DELETE CASCADE,
    PRIMARY KEY (db_id, category_id)
);

CREATE TABLE IF NOT EXISTS Guides (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT
);
"""

def create_tables():
    try:
        print("Đang kết nối đến PostgreSQL...")
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print("Đang khởi tạo các bảng...")
        cur.execute(CREATE_TABLES_SQL)
        
        # Lưu thay đổi
        conn.commit()
        print("Tạo bảng thành công!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Lỗi khi tạo bảng: {e}")

if __name__ == "__main__":
    create_tables()