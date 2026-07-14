# 🌟 Thư Viện Số Mở CTUT - Cổng Liên Kết CSDL Học Thuật Uy Tín (arXiv, DOAJ, VJOL)

Hệ thống website **Thư Viện Số Mở CTUT (Open Digital Library)** tích hợp và liên kết trực tiếp với các Cơ sở dữ liệu khoa học uy tín, truy cập mở (Open Access) và hoàn toàn miễn phí trên toàn thế giới và Việt Nam.

---

## 🏛️ Các Cơ Sở Dữ Liệu Uy Tín Được Tích Hợp

| Cơ Sở Dữ Liệu | Loại hình | Quy mô | Lĩnh vực chuyên sâu | Đường dẫn chính thức |
| :--- | :--- | :--- | :--- | :--- |
| **arXiv** *(Cornell University)* | Preprints (Bản thảo điện tử) | **2.4+ triệu** bài báo | Khoa học máy tính, AI, Toán học, Vật lý | [arxiv.org](https://arxiv.org/) |
| **DOAJ** *(Directory of Open Access Journals)* | Peer-Reviewed OA Journals | **9.5+ triệu** bài báo | Đa ngành, Tạp chí có bình duyệt quốc tế | [doaj.org](https://doaj.org/) |
| **VJOL** *(Vietnam Journals Online - NASATI)* | Tạp chí Khoa học Việt Nam | **15,000+** bài báo | Khoa học Tự nhiên, Kỹ thuật & Xã hội VN | [vjol.info.vn](https://vjol.info.vn/) |
| **PubMed Central (PMC)** *(NIH/NLM)* | Thư viện y sinh học & khoa học sự sống | **9.0+ triệu** bài báo | Y khoa, Dược học, Sinh học, Y sinh | [ncbi.nlm.nih.gov/pmc](https://www.ncbi.nlm.nih.gov/pmc/) |
| **CORE** *(Connecting Repositories)* | Cỗ máy tìm kiếm tổng hợp (Aggregator) | **260+ triệu** tài liệu | Tổng hợp từ hàng ngàn kho lưu trữ đại học | [core.ac.uk](https://core.ac.uk/) |
| **Zenodo** *(CERN & OpenAIRE)* | Kho lưu trữ khoa học mở đa ngành | **3.0+ triệu** bản ghi | Bài báo, Datasets, Phần mềm, Mã nguồn | [zenodo.org](https://zenodo.org/) |
| **PLOS** *(Public Library of Science)* | Tạp chí khoa học phi lợi nhuận | **300,000+** bài báo | Y sinh, Khoa học tính toán, PLOS ONE | [plos.org](https://plos.org/) |
| **IEEE Open Access** | Cổng Tạp chí Mở IEEE | **120,000+** bài báo | Kỹ thuật Điện, Viễn thông & CNTT | [open.ieee.org](https://open.ieee.org/) |

---

## ✨ Tính Năng Nổi Bật Của Website

1. **Giao diện Hiện đại & Chuyên nghiệp (WOW Design)**:
   - Thiết kế chuẩn Glassmorphism kết hợp Dark/Light Mode linh hoạt.
   - Hiệu ứng chuyển động mượt mà, bộ đếm số liệu tương tác real-time.
2. **Hệ thống Tìm kiếm & Lọc Đa Chiều**:
   - Tìm kiếm nhanh từ khóa qua thanh tìm kiếm toàn cục.
   - Lọc CSDL theo chuyên ngành (Công nghệ thông tin, Toán & Vật lý, Y Dược, Kỹ thuật, Khoa học Xã hội...).
   - Lọc bài báo theo nguồn thu thập OAI-PMH (`arXiv`, `DOAJ`, `VJOL`).
3. **Công cụ Tạo Trích Dẫn Tự Động (1-Click Citation Generator)**:
   - Hỗ trợ xuất và sao chép tự động định dạng **APA 7th**, **IEEE**, và **BibTeX** cho mọi bài báo.
4. **Kiến trúc Linh hoạt (Hybrid Mode)**:
   - Hoạt động mượt mà ngay cả ở chế độ Standalone Frontend (mở trực tiếp file HTML hoặc qua Live Server) nhờ bộ dữ liệu dự phòng phong phú.
   - Kết nối trực tiếp với Backend FastAPI & PostgreSQL khi khởi chạy máy chủ API.

---

## 🚀 Hướng Dẫn Sử Dụng & Khởi Chạy

### Cấu trúc Thư mục
```text
ctut-ol-system/
├── frontend/                  # Giao diện Website Thư Viện Số Mở
│   ├── index.html             # Trang chủ ứng dụng web
│   ├── css/style.css          # Hệ thống giao diện Vanilla CSS
│   └── js/app.js              # Logic tương tác, lọc, trích dẫn & API fetch
├── backend/                   # API Server & OAI-PMH Harvester
│   ├── main.py                # FastAPI REST API Server (+ serve frontend static files)
│   ├── init_db.py             # Khởi tạo schema PostgreSQL
│   ├── seed_data.py           # Nạp dữ liệu CSDL & Bài báo mẫu
│   ├── oai_harvester.py       # Tự động thu thập metadata qua giao thức OAI-PMH
│   └── requirements.txt       # Danh sách thư viện Python
└── README.md                  # Tài liệu hướng dẫn
```

### Cách 1: Chạy trực tiếp Giao diện Web (Standalone)
- Mở file `frontend/index.html` trực tiếp trên trình duyệt web (Edge, Chrome, Firefox...) hoặc sử dụng **Live Server** trong VS Code.

### Cách 2: Chạy với Backend FastAPI
1. Cài đặt các thư viện Python:
   ```powershell
   pip install fastapi uvicorn psycopg2-binary python-dotenv sickle
   ```
2. Khởi chạy máy chủ API:
   ```powershell
   cd backend
   uvicorn main:app --reload --port 8000
   ```
3. Truy cập website tại: `http://localhost:8000/`
