# --- GIAI ĐOẠN 1: Build Frontend React ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- GIAI ĐOẠN 2: Setup Backend FastAPI ---
FROM python:3.11-slim
WORKDIR /app

# BỔ SUNG: Cài đặt các gói phụ thuộc hệ thống cần cho psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend
COPY --from=frontend-builder /app/frontend/dist ./backend/static

WORKDIR /app/backend
EXPOSE 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]