import os
from dotenv import load_dotenv
from mem0 import MemoryClient

load_dotenv()

memory = MemoryClient(
    api_key=os.getenv("MEM0_API_KEY")
)


def add_memory(user_id, text):
    result = memory.add(
        messages=[
            {
                "role": "user",
                "content": text
            }
        ],
        user_id=user_id
    )
    return result


def search_memory(user_id, query):
    result = memory.search(
        query=query,
        filters={
            "user_id": user_id
        }
    )
    return result