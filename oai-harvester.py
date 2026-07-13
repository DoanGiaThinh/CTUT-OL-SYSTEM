from sickle import Sickle
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Link OAI-PMH chuẩn của arXiv
OAI_URL = 'http://export.arxiv.org/oai2'

def harvest_arxiv_math():
    print(f"Đang kết nối đến OAI-PMH của arXiv...")
    sickle = Sickle(OAI_URL)
    
    # Lấy dữ liệu với định dạng oai_dc (Dublin Core - chuẩn chung nhất), thuộc nhóm math (Toán học)
    records = sickle.ListRecords(metadataPrefix='oai_dc', set='math', ignore_deleted=True)
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    print("Bắt đầu thu thập dữ liệu...")
    count = 0
    
    for record in records:
        if count >= 5: # Chỉ lấy thử 5 bài để test
            break
            
        metadata = record.metadata
        identifier = record.header.identifier
        
        # Bóc tách dữ liệu
        title = metadata.get('title', ['Không có tiêu đề'])[0]
        authors = ", ".join(metadata.get('creator', []))
        abstract = metadata.get('description', [''])[0]
        date = metadata.get('date', [''])[0]
        url = metadata.get('identifier', [''])[0] # Link bài viết thường nằm ở đây
        
        print(f"Đã hút được: {title[:50]}...")
        
        # Lưu vào PostgreSQL (Giả sử id của arXiv trong bảng Databases là 2)
        try:
            cur.execute("""
                INSERT INTO Articles (db_id, identifier, title, authors, abstract, date_published, url)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (identifier) DO NOTHING; -- Bỏ qua nếu bài báo đã tồn tại
            """, (2, identifier, title, authors, abstract, date, url))
        except Exception as e:
            print(f"Lỗi lưu DB: {e}")
            conn.rollback()
            
        count += 1
        
    conn.commit()
    cur.close()
    conn.close()
    print("Thu thập hoàn tất!")

if __name__ == "__main__":
    harvest_arxiv_math()

#BOT Cron Job