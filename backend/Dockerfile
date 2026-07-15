# Bước 1: Chọn môi trường Python phiên bản 3.11 gọn nhẹ (slim)
FROM python:3.11-slim

# Bước 2: Tạo và di chuyển vào thư mục /app bên trong Docker
WORKDIR /app

# Bước 3: Copy file danh sách thư viện vào trước để tối ưu cache
COPY requirements.txt .

# Bước 4: Chạy lệnh cài đặt các thư viện Python
RUN pip install --no-cache-dir -r requirements.txt

# Bước 5: Copy toàn bộ code từ máy vào thư mục /app trong Docker
COPY . .

# Bước 6: Mở cổng 8000 cho FastAPI
EXPOSE 8000

# Bước 7: Lệnh khởi chạy ứng dụng khi container chạy
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]