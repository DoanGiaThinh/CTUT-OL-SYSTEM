# Forward script cho Render khi chạy python seed_data.py từ thư mục gốc
from backend.seed_data import seed

if __name__ == "__main__":
    seed()
