import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import engine, Base
from routes import router

# Khởi tạo bảng CSDL tự động nếu chưa có
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Open Digital Library API - CTUT",
    description="Hệ thống Thư viện số mở tích hợp tra cứu học thuật arXiv, DOAJ, VJOL và quản lý mượn/trả sách số nội bộ.",
    version="1.0.0"
)

# Cấu hình CORS để cho phép Frontend React (localhost:5173 và các origin khác) truy cập API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api", tags=["Digital Library & Academic Search API"])

# Cấu hình phục vụ giao diện React (Frontend Single Page Application) khi chạy trong Docker
STATIC_DIR = "static"
assets_dir = os.path.join(STATIC_DIR, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/")
async def serve_root():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {
        "status": "active",
        "system": "Website Thư viện số mở (Open Digital Library API)",
        "docs_url": "/docs",
        "api_prefix": "/api"
    }

# Catch-all cho React Router (hỗ trợ refresh trang tại /library, /search, /dashboard...)
@app.get("/{full_path:path}")
async def serve_frontend_spa(full_path: str):
    file_path = os.path.join(STATIC_DIR, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {
        "error": "Not Found",
        "detail": f"Path '{full_path}' not found."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

