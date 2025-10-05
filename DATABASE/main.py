from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2, shutil, os
from psycopg2.extras import RealDictCursor

app = FastAPI()

# ✅ Allow frontend to talk with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # किंवा ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "dbname": "universitydb",
    "user": "rasa_user",
    "password": "Shubh874",
    "host": "localhost",
    "port": "5432"
}

UPLOAD_SECRET = "Upload@123"  # 🔑 वेगळं password for uploads

def connect_db():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)

# ==========================
# 🔹 LOGIN API
# ==========================
class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

@app.post("/login")
def login(data: LoginRequest):
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, email, role FROM users 
        WHERE email=%s AND password=%s AND role=%s
    """, (data.email, data.password, data.role))
    user = cur.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return user


# ==========================
# 🔹 ADMIN UPLOAD API
# ==========================
@app.post("/admin-upload")
async def admin_upload(
    db_password: str = Form(...),
    doc_type: str = Form(...),
    file: UploadFile = File(...)
):
    # Password check
    if db_password != UPLOAD_SECRET:
        raise HTTPException(status_code=403, detail="❌ Invalid upload password")

    # Save file
    save_dir = "uploads"
    os.makedirs(save_dir, exist_ok=True)
    file_path = os.path.join(save_dir, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Store in DB
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO documents (student_id, file_name, file_path, doc_type, status)
        VALUES (%s, %s, %s, %s, %s) RETURNING id
    """, (None, file.filename, file_path, doc_type, "Stored by Admin"))
    doc_id = cur.fetchone()["id"]
    conn.commit()
    conn.close()

    return {"message": "✅ Document uploaded by Admin", "doc_id": doc_id}


# ==========================
# 🔹 STUDENT VIEW DOCS
# ==========================
@app.get("/all-docs")
def all_docs():
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM documents ORDER BY uploaded_at DESC;")
    docs = cur.fetchall()
    conn.close()
    return docs
