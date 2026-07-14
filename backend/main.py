from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Thư Viện Số Mở CTUT - Open Digital Library",
    description="Cổng thông tin Thư viện số mở tích hợp liên kết đến các Cơ sở dữ liệu uy tín và miễn phí (arXiv, DOAJ, VJOL...)",
    version="2.0.0"
)

# Kích hoạt CORS cho phép giao tiếp từ mọi Origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    try:
        if not DATABASE_URL:
            return None
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None

# ==================== DỮ LIỆU MẪU DỰ PHÒNG (FALLBACK DATA) ====================
FALLBACK_DATABASES = [
    {
        "id": 1,
        "name": "arXiv (Cornell University)",
        "url": "https://arxiv.org/",
        "description": "Kho lưu trữ bản thảo điện tử truy cập mở (Open Access Preprints) hàng đầu thế giới với hơn 2.4 triệu bài nghiên cứu thuộc Khoa học Máy tính, Toán học, Vật lý, Trí tuệ nhân tạo (AI), Sinh học định lượng và Tài chính.",
        "status": "active",
        "logo_url": "https://static.arxiv.org/static/browse/0.3.4/images/arxiv-logo-fb.png",
        "access_type": "100% Miễn phí / Open Access",
        "doc_count": "2,400,000+ tài liệu",
        "badge_color": "cyan",
        "categories": ["CNTT", "Toán Lý", "Đa ngành"]
    },
    {
        "id": 2,
        "name": "DOAJ (Directory of Open Access Journals)",
        "url": "https://doaj.org/",
        "description": "Danh mục Tạp chí Truy cập Mở Quốc tế uy tín nhất thế giới, lập chỉ mục hơn 20,000 tạp chí khoa học có bình duyệt (Peer-Reviewed) đa ngành với hơn 9.5 triệu bài báo toàn văn miễn phí.",
        "status": "active",
        "logo_url": "https://doaj.org/static/doaj/images/logo-doaj.png",
        "access_type": "100% Miễn phí / Peer-Reviewed",
        "doc_count": "9,500,000+ bài báo",
        "badge_color": "emerald",
        "categories": ["Đa ngành", "Y Dược", "KHXH"]
    },
    {
        "id": 3,
        "name": "VJOL (Vietnam Journals Online)",
        "url": "https://vjol.info.vn/",
        "description": "Cơ sở dữ liệu Tạp chí Khoa học Việt Nam trực tuyến do Cục Thông tin KH&CN Quốc gia (NASATI) quản lý. Tổng hợp các tạp chí khoa học uy tín xuất bản tại Việt Nam thuộc đủ các lĩnh vực tự nhiên, xã hội và kỹ thuật.",
        "status": "active",
        "logo_url": "https://vjol.info.vn/public/site/images/admin/logo-vjol.png",
        "access_type": "Miễn phí / Tạp chí KH Việt Nam",
        "doc_count": "15,000+ bài nghiên cứu",
        "badge_color": "rose",
        "categories": ["Đa ngành", "Kỹ thuật", "KHXH"]
    },
    {
        "id": 4,
        "name": "PubMed Central (PMC - NIH/NLM)",
        "url": "https://www.ncbi.nlm.nih.gov/pmc/",
        "description": "Thư viện số y sinh học và khoa học sự sống miễn phí của Thư viện Y khoa Quốc gia Hoa Kỳ (NLM) thuộc Viện Y tế Quốc gia (NIH), cung cấp toàn văn miễn phí hàng triệu bài báo nghiên cứu lâm sàng và sinh học.",
        "status": "active",
        "logo_url": "https://www.ncbi.nlm.nih.gov/pmc/static/img/pmc-logo.png",
        "access_type": "100% Miễn phí / Toàn văn",
        "doc_count": "9,000,000+ bài báo",
        "badge_color": "blue",
        "categories": ["Y Dược"]
    },
    {
        "id": 5,
        "name": "CORE (Connecting Repositories)",
        "url": "https://core.ac.uk/",
        "description": "Cỗ máy tìm kiếm bài báo truy cập mở toàn cầu lớn nhất, tổng hợp siêu dữ liệu và toàn văn từ hàng ngàn kho lưu trữ của các trường đại học và viện nghiên cứu trên khắp thế giới.",
        "status": "active",
        "logo_url": "https://core.ac.uk/images/logo.png",
        "access_type": "100% Miễn phí / Aggregator",
        "doc_count": "260,000,000+ tài liệu",
        "badge_color": "amber",
        "categories": ["Đa ngành"]
    },
    {
        "id": 6,
        "name": "Zenodo (CERN & OpenAIRE)",
        "url": "https://zenodo.org/",
        "description": "Kho lưu trữ khoa học mở đa ngành do CERN phát triển, cho phép các nhà nghiên cứu chia sẻ bài báo, bộ dữ liệu (dataset), phần mềm và tài liệu nghiên cứu dưới chứng chỉ Creative Commons.",
        "status": "active",
        "logo_url": "https://zenodo.org/static/images/zenodo-logo.svg",
        "access_type": "100% Miễn phí / DOI Gán nhãn",
        "doc_count": "3,000,000+ bản ghi",
        "badge_color": "purple",
        "categories": ["CNTT", "Toán Lý", "Đa ngành"]
    },
    {
        "id": 7,
        "name": "PLOS (Public Library of Science)",
        "url": "https://plos.org/",
        "description": "Tổ chức xuất bản khoa học phi lợi nhuận truy cập mở hàng đầu, phát hành các tạp chí uy tín toàn cầu như PLOS ONE, PLOS Biology, PLOS Computational Biology với quy trình bình duyệt nghiêm ngặt.",
        "status": "active",
        "logo_url": "https://plos.org/wp-content/uploads/2020/06/plos-logo.png",
        "access_type": "Open Access / Peer-Reviewed",
        "doc_count": "300,000+ bài báo",
        "badge_color": "teal",
        "categories": ["Y Dược", "CNTT"]
    },
    {
        "id": 8,
        "name": "IEEE Open Access",
        "url": "https://open.ieee.org/",
        "description": "Cổng truy cập mở của Hiệp hội Kỹ sư Điện & Điện tử (IEEE), bao gồm IEEE Access và các tạp chí truy cập mở hoàn toàn về công nghệ viễn thông, máy tính, tự động hóa và năng lượng.",
        "status": "active",
        "logo_url": "https://open.ieee.org/wp-content/uploads/ieee-oa-logo.png",
        "access_type": "Open Access Journals",
        "doc_count": "120,000+ bài nghiên cứu",
        "badge_color": "indigo",
        "categories": ["CNTT", "Kỹ thuật"]
    }
]

FALLBACK_ARTICLES = [
    {
        "id": 1,
        "db_id": 1,
        "db_name": "arXiv",
        "identifier": "oai:arXiv.org:2401.01234",
        "title": "Attention Is All You Need: Advanced Transformer Architectures for Vietnamese Language Processing",
        "authors": "Nguyen Van A, Tran Thi B, Le Hoang C",
        "abstract": "Nghiên cứu này khảo sát các mô hình Transformer tiên tiến ứng dụng cho xử lý ngôn ngữ tự nhiên tiếng Việt, tối ưu hóa hiệu suất trên các tập dữ liệu quy mô lớn và giảm chi phí tính toán 40%.",
        "date_published": "2024-03-15",
        "url": "https://arxiv.org/abs/2401.01234"
    },
    {
        "id": 2,
        "db_id": 1,
        "db_name": "arXiv",
        "identifier": "oai:arXiv.org:2402.05678",
        "title": "Deep Reinforcement Learning for Smart Grid Energy Optimization",
        "authors": "Pham Minh D, Hoang Quang E",
        "abstract": "Bài báo đề xuất mô hình học tăng cường sâu (Deep Reinforcement Learning) nhằm điều phối và tối ưu hóa phân phối năng lượng trong lưới điện thông minh với tích hợp năng lượng tái tạo.",
        "date_published": "2024-04-10",
        "url": "https://arxiv.org/abs/2402.05678"
    },
    {
        "id": 3,
        "db_id": 2,
        "db_name": "DOAJ",
        "identifier": "doaj:article:10.1186/s12859-024-00123",
        "title": "Open Access Publishing Trends in Southeast Asian Higher Education Institutions",
        "authors": "Nguyen Thanh T, Smith J R",
        "abstract": "Phân tích xu hướng phát triển thư viện số mở và xuất bản truy cập mở tại các trường đại học Đông Nam Á trong giai đoạn 2018-2024, phân tích tác động đến số lượng trích dẫn khoa học.",
        "date_published": "2024-02-20",
        "url": "https://doaj.org/"
    },
    {
        "id": 4,
        "db_id": 3,
        "db_name": "VJOL",
        "identifier": "vjol:article:ctut:2024:101",
        "title": "Ứng dụng Trí tuệ Nhân tạo trong Xây dựng Hệ thống Thư viện Số Mở cho Trường Đại học Kỹ thuật Công nghệ",
        "authors": "Đoàn Gia T, Nguyễn Văn M",
        "abstract": "Bài báo giới thiệu kiến trúc hệ thống Thư viện Số Mở tích hợp chuẩn OAI-PMH nhằm tự động hóa việc thu thập metadata từ các CSDL uy tín như arXiv, DOAJ, VJOL phục vụ giảng viên và sinh viên.",
        "date_published": "2024-05-12",
        "url": "https://vjol.info.vn/"
    },
    {
        "id": 5,
        "db_id": 3,
        "db_name": "VJOL",
        "identifier": "vjol:article:ctut:2024:102",
        "title": "Đánh giá hiệu năng giải thuật phân cụm dữ liệu lớn trên nền tảng Apache Spark",
        "authors": "Lê Văn K, Trần Thị N",
        "abstract": "Thực nghiệm và so sánh hiệu năng các giải thuật K-Means, DBSCAN trên hệ phân tán nhằm xử lý dữ liệu hồ sơ tài liệu thư viện điện tử quy mô hàng triệu bản ghi.",
        "date_published": "2024-04-05",
        "url": "https://vjol.info.vn/"
    }
]

FALLBACK_CATEGORIES = [
    {"id": 1, "type": "CNTT", "name": "Công nghệ thông tin & Khoa học máy tính", "count": 4},
    {"id": 2, "type": "TOAN_LY", "name": "Toán học & Vật lý kỹ thuật", "count": 3},
    {"id": 3, "type": "Y_DUOC", "name": "Y dược & Khoa học sự sống", "count": 3},
    {"id": 4, "type": "KT_CN", "name": "Kỹ thuật & Công nghệ ứng dụng", "count": 4},
    {"id": 5, "type": "KHXH", "name": "Khoa học Xã hội & Nhân văn", "count": 3},
    {"id": 6, "type": "KINH_TE", "name": "Kinh tế & Quản lý kinh doanh", "count": 2},
    {"id": 7, "type": "DA_NGANH", "name": "Tạp chí Đa ngành & Tổng hợp", "count": 6}
]

FALLBACK_GUIDES = [
    {
        "id": 1,
        "title": "Hướng dẫn tra cứu hiệu quả trên arXiv",
        "content": "arXiv cho phép tìm kiếm theo tiêu đề, tác giả hoặc mã số định danh (arXiv ID). Sử dụng cú pháp nâng cao như 'ti:deep learning AND au:bengio' để tìm các bài báo về Deep Learning của tác giả Bengio. Bạn có thể tải trực tiếp file PDF miễn phí không cần đăng ký tài khoản.",
        "media_url": "https://arxiv.org/help"
    },
    {
        "id": 2,
        "title": "Khai thác Tạp chí Khoa học Việt Nam trên VJOL",
        "content": "VJOL cung cấp quyền truy cập toàn văn miễn phí vào các tạp chí thuộc trường Đại học và Viện nghiên cứu Việt Nam. Bạn có thể duyệt theo Danh mục Tạp chí (theo lĩnh vực Khoa học Tự nhiên, Xã hội, Kỹ thuật) hoặc sử dụng thanh tìm kiếm từ khóa tiếng Việt.",
        "media_url": "https://vjol.info.vn/"
    },
    {
        "id": 3,
        "title": "Cách lọc bài báo có bình duyệt (Peer-Reviewed) trên DOAJ",
        "content": "DOAJ là chuẩn mực của tạp chí Open Access uy tín. Khi tra cứu trên DOAJ, chọn bộ lọc 'Journals without APC' nếu muốn tìm tạp chí miễn phí phí xuất bản cho tác giả, hoặc lọc theo giấy phép Creative Commons (CC BY, CC BY-NC) để biết quyền tái sử dụng bài báo.",
        "media_url": "https://doaj.org/"
    }
]

@app.get("/check_db")
def check_db():
    conn = get_db_connection()
    if conn:
        conn.close()
        return {"status": "Database connection successful"}
    else:
        return {"status": "Database connection fallback mode active"}

@app.get("/api/databases")
def get_all_databases(search: str = Query(None, description="Tìm kiếm từ khóa")):
    conn = get_db_connection()
    if not conn:
        result = FALLBACK_DATABASES
        if search:
            q = search.lower()
            result = [db for db in FALLBACK_DATABASES if q in db["name"].lower() or q in db["description"].lower()]
        return {"status": "success", "data": result, "mode": "fallback"}
    
    try:
        cur = conn.cursor()
        query = """
            SELECT id, name, url, description, status, COALESCE(logo_url, ''), COALESCE(access_type, 'Open Access'), COALESCE(doc_count, 'N/A')
            FROM Databases
        """
        params = []
        if search:
            query += " WHERE LOWER(name) LIKE %s OR LOWER(description) LIKE %s"
            q_param = f"%{search.lower()}%"
            params.extend([q_param, q_param])
        query += " ORDER BY id ASC;"
        
        cur.execute(query, params)
        rows = cur.fetchall()
        
        database_list = []
        for row in rows:
            database_list.append({
                "id": row[0],
                "name": row[1],
                "url": row[2],
                "description": row[3],
                "status": row[4],
                "logo_url": row[5],
                "access_type": row[6],
                "doc_count": row[7]
            })
            
        cur.close()
        conn.close()
        return {"status": "success", "data": database_list, "mode": "database"}
    except Exception as e:
        return {"status": "success", "data": FALLBACK_DATABASES, "mode": "fallback_on_error", "error": str(e)}

@app.get("/api/databases/{db_id}")
def get_database_by_id(db_id: int):
    conn = get_db_connection()
    if not conn:
        db = next((d for d in FALLBACK_DATABASES if d["id"] == db_id), None)
        if not db:
            raise HTTPException(status_code=404, detail="Không tìm thấy CSDL")
        return {"status": "success", "data": db}
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT id, name, url, description, status, COALESCE(logo_url, ''), COALESCE(access_type, 'Open Access'), COALESCE(doc_count, 'N/A')
            FROM Databases WHERE id = %s
        """, (db_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Không tìm thấy CSDL")
        data = {
            "id": row[0], "name": row[1], "url": row[2], "description": row[3],
            "status": row[4], "logo_url": row[5], "access_type": row[6], "doc_count": row[7]
        }
        cur.close()
        conn.close()
        return {"status": "success", "data": data}
    except Exception as e:
        db = next((d for d in FALLBACK_DATABASES if d["id"] == db_id), None)
        return {"status": "success", "data": db}

@app.get("/api/articles")
def get_articles(
    search: str = Query(None, description="Tìm kiếm bài báo theo tiêu đề hoặc tác giả"),
    db_id: int = Query(None, description="Lọc theo id CSDL")
):
    conn = get_db_connection()
    if not conn:
        result = FALLBACK_ARTICLES
        if db_id:
            result = [a for a in result if a["db_id"] == db_id]
        if search:
            q = search.lower()
            result = [a for a in result if q in a["title"].lower() or q in a["authors"].lower() or q in a["abstract"].lower()]
        return {"status": "success", "data": result, "mode": "fallback"}
    try:
        cur = conn.cursor()
        query = """
            SELECT a.id, a.db_id, COALESCE(d.name, 'Open Database'), a.identifier, a.title, a.authors, a.abstract, a.date_published, a.url
            FROM Articles a
            LEFT JOIN Databases d ON a.db_id = d.id
            WHERE 1=1
        """
        params = []
        if db_id:
            query += " AND a.db_id = %s"
            params.append(db_id)
        if search:
            query += " AND (LOWER(a.title) LIKE %s OR LOWER(a.authors) LIKE %s OR LOWER(a.abstract) LIKE %s)"
            q_param = f"%{search.lower()}%"
            params.extend([q_param, q_param, q_param])
        query += " ORDER BY a.id DESC LIMIT 50;"
        
        cur.execute(query, params)
        rows = cur.fetchall()
        articles = []
        for row in rows:
            articles.append({
                "id": row[0],
                "db_id": row[1],
                "db_name": row[2],
                "identifier": row[3],
                "title": row[4],
                "authors": row[5],
                "abstract": row[6],
                "date_published": row[7],
                "url": row[8]
            })
        cur.close()
        conn.close()
        return {"status": "success", "data": articles, "mode": "database"}
    except Exception as e:
        return {"status": "success", "data": FALLBACK_ARTICLES, "mode": "fallback_on_error"}

@app.get("/api/categories")
def get_categories():
    return {"status": "success", "data": FALLBACK_CATEGORIES}

@app.get("/api/guides")
def get_guides():
    return {"status": "success", "data": FALLBACK_GUIDES}

# Mount thư mục frontend để khi truy cập http://localhost:8000 (hoặc URL Render) sẽ hiển thị website
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
