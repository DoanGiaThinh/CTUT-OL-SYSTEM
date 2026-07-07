from fastapi import FastAPI
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Thư Viện Số Mở CTUT")

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None
    
@app.get("/")
def read_root():
    return {"message": "Chào Mừng bạn đến với Thư Viện Số Mở CTUT!"}

@app.get("/check_db")
def check_db():
    conn = get_db_connection()
    if conn:
        conn.close()
        return {"status": "Database connection successful"}
    else:
        return {"status": "Database connection failed"}