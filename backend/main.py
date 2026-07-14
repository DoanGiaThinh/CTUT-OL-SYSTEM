from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/")
def read_root():
    return {
        "status": "active",
        "system": "Website Thư viện số mở (Open Digital Library API)",
        "docs_url": "/docs",
        "api_prefix": "/api"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
