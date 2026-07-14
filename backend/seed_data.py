import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

CATEGORIES = [
    (1, "CNTT", "Công nghệ thông tin & Khoa học máy tính"),
    (2, "TOAN_LY", "Toán học & Vật lý kỹ thuật"),
    (3, "Y_DUOC", "Y dược & Khoa học sự sống"),
    (4, "KT_CN", "Kỹ thuật & Công nghệ ứng dụng"),
    (5, "KHXH", "Khoa học Xã hội & Nhân văn"),
    (6, "KINH_TE", "Kinh tế & Quản lý kinh doanh"),
    (7, "DA_NGANH", "Tạp chí Đa ngành & Tổng hợp")
]

DATABASES = [
    (
        1,
        "arXiv (Cornell University)",
        "https://arxiv.org/",
        "Kho lưu trữ bản thảo điện tử truy cập mở (Open Access Preprints) hàng đầu thế giới với hơn 2.4 triệu bài nghiên cứu thuộc Khoa học Máy tính, Toán học, Vật lý, Trí tuệ nhân tạo (AI), Sinh học định lượng và Tài chính.",
        "active",
        "https://static.arxiv.org/static/browse/0.3.4/images/arxiv-logo-fb.png",
        "100% Miễn phí / Open Access",
        "2,400,000+ tài liệu"
    ),
    (
        2,
        "DOAJ (Directory of Open Access Journals)",
        "https://doaj.org/",
        "Danh mục Tạp chí Truy cập Mở Quốc tế uy tín nhất thế giới, lập chỉ mục hơn 20,000 tạp chí khoa học có bình duyệt (Peer-Reviewed) đa ngành với hơn 9.5 triệu bài báo toàn văn miễn phí.",
        "active",
        "https://doaj.org/static/doaj/images/logo-doaj.png",
        "100% Miễn phí / Peer-Reviewed",
        "9,500,000+ bài báo"
    ),
    (
        3,
        "VJOL (Vietnam Journals Online)",
        "https://vjol.info.vn/",
        "Cơ sở dữ liệu Tạp chí Khoa học Việt Nam trực tuyến do Cục Thông tin KH&CN Quốc gia (NASATI) quản lý. Tổng hợp các tạp chí khoa học uy tín xuất bản tại Việt Nam thuộc đủ các lĩnh vực tự nhiên, xã hội và kỹ thuật.",
        "active",
        "https://vjol.info.vn/public/site/images/admin/logo-vjol.png",
        "Miễn phí / Tạp chí KH Việt Nam",
        "15,000+ bài nghiên cứu"
    ),
    (
        4,
        "PubMed Central (PMC - NIH/NLM)",
        "https://www.ncbi.nlm.nih.gov/pmc/",
        "Thư viện số y sinh học và khoa học sự sống miễn phí của Thư viện Y khoa Quốc gia Hoa Kỳ (NLM) thuộc Viện Y tế Quốc gia (NIH), cung cấp toàn văn miễn phí hàng triệu bài báo nghiên cứu lâm sàng và sinh học.",
        "active",
        "https://www.ncbi.nlm.nih.gov/pmc/static/img/pmc-logo.png",
        "100% Miễn phí / Toàn văn",
        "9,000,000+ bài báo"
    ),
    (
        5,
        "CORE (Connecting Repositories)",
        "https://core.ac.uk/",
        "Cỗ máy tìm kiếm bài báo truy cập mở toàn cầu lớn nhất, tổng hợp siêu dữ liệu và toàn văn từ hàng ngàn kho lưu trữ của các trường đại học và viện nghiên cứu trên khắp thế giới.",
        "active",
        "https://core.ac.uk/images/logo.png",
        "100% Miễn phí / Aggregator",
        "260,000,000+ tài liệu"
    ),
    (
        6,
        "Zenodo (CERN & OpenAIRE)",
        "https://zenodo.org/",
        "Kho lưu trữ khoa học mở đa ngành do CERN phát triển, cho phép các nhà nghiên cứu chia sẻ bài báo, bộ dữ liệu (dataset), phần mềm và tài liệu nghiên cứu dưới chứng chỉ Creative Commons.",
        "active",
        "https://zenodo.org/static/images/zenodo-logo.svg",
        "100% Miễn phí / DOI Gán nhãn",
        "3,000,000+ bản ghi"
    ),
    (
        7,
        "PLOS (Public Library of Science)",
        "https://plos.org/",
        "Tổ chức xuất bản khoa học phi lợi nhuận truy cập mở hàng đầu, phát hành các tạp chí uy tín toàn cầu như PLOS ONE, PLOS Biology, PLOS Computational Biology với quy trình bình duyệt nghiêm ngặt.",
        "active",
        "https://plos.org/wp-content/uploads/2020/06/plos-logo.png",
        "Open Access / Peer-Reviewed",
        "300,000+ bài báo"
    ),
    (
        8,
        "IEEE Open Access",
        "https://open.ieee.org/",
        "Cổng truy cập mở của Hiệp hội Kỹ sư Điện & Điện tử (IEEE), bao gồm IEEE Access và các tạp chí truy cập mở hoàn toàn về công nghệ viễn thông, máy tính, tự động hóa và năng lượng.",
        "active",
        "https://open.ieee.org/wp-content/uploads/ieee-oa-logo.png",
        "Open Access Journals",
        "120,000+ bài nghiên cứu"
    )
]

DATABASE_CATEGORIES = [
    (1, 1), (1, 2), # arXiv -> CNTT, Toán Lý
    (2, 7), (2, 1), (2, 3), (2, 4), (2, 5), # DOAJ -> Đa ngành
    (3, 7), (3, 4), (3, 5), (3, 6), # VJOL -> Tạp chí KH VN đa ngành
    (4, 3), # PubMed -> Y Dược
    (5, 7), (5, 1), # CORE -> Đa ngành
    (6, 7), (6, 1), (6, 2), # Zenodo -> Đa ngành
    (7, 3), (7, 1), # PLOS -> Y sinh, tính toán
    (8, 1), (8, 4)  # IEEE -> CNTT, Kỹ thuật
]

GUIDES = [
    (
        1,
        "Hướng dẫn tra cứu hiệu quả trên arXiv",
        "arXiv cho phép tìm kiếm theo tiêu đề, tác giả hoặc mã số định danh (arXiv ID). Sử dụng cú pháp nâng cao như 'ti:deep learning AND au:bengio' để tìm các bài báo về Deep Learning của tác giả Bengio. Bạn có thể tải trực tiếp file PDF miễn phí không cần đăng ký tài khoản.",
        "https://arxiv.org/help"
    ),
    (
        2,
        "Khai thác Tạp chí Khoa học Việt Nam trên VJOL",
        "VJOL cung cấp quyền truy cập toàn văn miễn phí vào các tạp chí thuộc trường Đại học và Viện nghiên cứu Việt Nam. Bạn có thể duyệt theo Danh mục Tạp chí (theo lĩnh vực Khoa học Tự nhiên, Xã hội, Kỹ thuật) hoặc sử dụng thanh tìm kiếm từ khóa tiếng Việt.",
        "https://vjol.info.vn/"
    ),
    (
        3,
        "Cách lọc bài báo có bình duyệt (Peer-Reviewed) trên DOAJ",
        "DOAJ là chuẩn mực của tạp chí Open Access uy tín. Khi tra cứu trên DOAJ, chọn bộ lọc 'Journals without APC' nếu muốn tìm tạp chí miễn phí phí xuất bản cho tác giả, hoặc lọc theo giấy phép Creative Commons (CC BY, CC BY-NC) để biết quyền tái sử dụng bài báo.",
        "https://doaj.org/"
    )
]

ARTICLES = [
    (
        1,
        "oai:arXiv.org:2401.01234",
        "Attention Is All You Need: Advanced Transformer Architectures for Vietnamese Language Processing",
        "Nguyen Van A, Tran Thi B, Le Hoang C",
        "Nghiên cứu này khảo sát các mô hình Transformer tiên tiến ứng dụng cho xử lý ngôn ngữ tự nhiên tiếng Việt, tối ưu hóa hiệu suất trên các tập dữ liệu quy mô lớn và giảm chi phí tính toán.",
        "2024-03-15",
        "https://arxiv.org/abs/2401.01234"
    ),
    (
        1,
        "oai:arXiv.org:2402.05678",
        "Deep Reinforcement Learning for Smart Grid Energy Optimization",
        "Pham Minh D, Hoang Quang E",
        "Bài báo đề xuất mô hình học tăng cường sâu (Deep Reinforcement Learning) nhằm điều phối và tối ưu hóa phân phối năng lượng trong lưới điện thông minh với tích hợp năng lượng tái tạo.",
        "2024-04-10",
        "https://arxiv.org/abs/2402.05678"
    ),
    (
        2,
        "doaj:article:10.1186/s12859-024-00123",
        "Open Access Publishing Trends in Southeast Asian Higher Education Institutions",
        "Nguyen Thanh T, Smith J R",
        "Phân tích xu hướng phát triển thư viện số mở và xuất bản truy cập mở tại các trường đại học Đông Nam Á trong giai đoạn 2018-2024, phân tích tác động đến số lượng trích dẫn khoa học.",
        "2024-02-20",
        "https://doaj.org/article/example1"
    ),
    (
        3,
        "vjol:article:ctut:2024:101",
        "Ứng dụng Trí tuệ Nhân tạo trong Xây dựng Hệ thống Thư viện Số Mở cho Trường Đại học Kỹ thuật Công nghệ",
        "Đoàn Gia T, Nguyễn Văn M",
        "Bài báo giới thiệu kiến trúc hệ thống Thư viện Số Mở tích hợp chuẩn OAI-PMH nhằm tự động hóa việc thu thập metadata từ các CSDL uy tín như arXiv, DOAJ, VJOL phục vụ giảng viên và sinh viên.",
        "2024-05-12",
        "https://vjol.info.vn/index.php/example"
    ),
    (
        3,
        "vjol:article:ctut:2024:102",
        "Đánh giá hiệu năng giải thuật phân cụm dữ liệu lớn trên nền tảng Apache Spark",
        "Lê Văn K, Trần Thị N",
        "Thực nghiệm và so sánh hiệu năng các giải thuật K-Means, DBSCAN trên hệ phân tán nhằm xử lý dữ liệu hồ sơ tài liệu thư viện điện tử quy mô hàng triệu bản ghi.",
        "2024-04-05",
        "https://vjol.info.vn/index.php/example2"
    )
]

def seed():
    if not DATABASE_URL:
        print("DATABASE_URL chưa được thiết lập trong .env. Bỏ qua kết nối PostgreSQL.")
        return
    try:
        print("Đang kết nối đến PostgreSQL để nạp dữ liệu mẫu...")
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Cập nhật bảng Databases để thêm cột logo_url, access_type, doc_count nếu chưa có
        cur.execute("""
            ALTER TABLE Databases ADD COLUMN IF NOT EXISTS logo_url TEXT;
            ALTER TABLE Databases ADD COLUMN IF NOT EXISTS access_type VARCHAR(100);
            ALTER TABLE Databases ADD COLUMN IF NOT EXISTS doc_count VARCHAR(100);
        """)
        
        # Insert Categories
        for cat in CATEGORIES:
            cur.execute("""
                INSERT INTO Categories (id, type, name)
                VALUES (%s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET type=EXCLUDED.type, name=EXCLUDED.name;
            """, cat)
            
        # Insert Databases
        for db in DATABASES:
            cur.execute("""
                INSERT INTO Databases (id, name, url, description, status, logo_url, access_type, doc_count)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    name=EXCLUDED.name,
                    url=EXCLUDED.url,
                    description=EXCLUDED.description,
                    status=EXCLUDED.status,
                    logo_url=EXCLUDED.logo_url,
                    access_type=EXCLUDED.access_type,
                    doc_count=EXCLUDED.doc_count;
            """, db)
            
        # Insert Database_Category
        for db_id, cat_id in DATABASE_CATEGORIES:
            cur.execute("""
                INSERT INTO Database_Category (db_id, category_id)
                VALUES (%s, %s)
                ON CONFLICT (db_id, category_id) DO NOTHING;
            """, (db_id, cat_id))
            
        # Insert Guides
        for g in GUIDES:
            cur.execute("""
                INSERT INTO Guides (id, title, content, media_url)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    title=EXCLUDED.title,
                    content=EXCLUDED.content,
                    media_url=EXCLUDED.media_url;
            """, g)
            
        # Insert Articles
        for art in ARTICLES:
            cur.execute("""
                INSERT INTO Articles (db_id, identifier, title, authors, abstract, date_published, url)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (identifier) DO UPDATE SET
                    title=EXCLUDED.title,
                    authors=EXCLUDED.authors,
                    abstract=EXCLUDED.abstract,
                    url=EXCLUDED.url;
            """, art)

        conn.commit()
        cur.close()
        conn.close()
        print("Nạp dữ liệu mẫu thành công!")
    except Exception as e:
        print(f"Lỗi khi nạp dữ liệu mẫu: {e}")

if __name__ == "__main__":
    seed()
