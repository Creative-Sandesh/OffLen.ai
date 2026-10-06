import httpx

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "llama3.2:3b"

async def generate_response(message:str) -> str:
    
    payload = {
        "model":MODEL_NAME,
        "messages": [
            {
                "role":"system",
                "content": ("you are a helpful educational tutor."
                            "Explain concept clearly and simplu for student of class 10."
                            ),
            },
            {
                "role":"user",
                "content":message,
            },
        ],
        "stream": False,
    }
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            OLLAMA_URL,
            json=payload,
        )
        response.raise_for_status()
        
        data = response.json()
        
        return data["message"]["content"]