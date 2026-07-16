from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from memory_service import add_memory, search_memory


app = FastAPI(
    title="SaveBite AI Backend",
    description="Backend with Mem0 AI Memory Integration",
    version="1.0"
)


# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Home test route
@app.get("/")
def home():
    return {
        "message": "SaveBite AI Backend Running 🚀"
    }


# Add user memory
@app.post("/memory/add")
def create_memory(
    user_id: str,
    text: str
):
    return add_memory(
        user_id,
        text
    )


# Search user memory
@app.get("/memory/search")
def get_memory(
    user_id: str,
    query: str
):
    return search_memory(
        user_id,
        query
    )