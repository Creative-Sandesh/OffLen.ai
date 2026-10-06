import httpx

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "llama3.2:3b"

SYSTEM_PROMPT = """ 
You are an education AI tutor.

Your job is to help students understand concepts clearly.

Rules:
- Use simple and clear language.
- Adapt explanations to the student's level.
- Give examples when useful.
- Break difficult topics into smaller steps.
- Encourage understanding instead of only giving answers.
- If the student asks a follow-up question, use the previous
  conversation to understand what they mean.

"""

async def generate_response(messages:list[dict[str,str]]) -> str:
    recent_messages = messages[-20:]
    
    ollama_messages = [{
        "role": "system",
        "content": SYSTEM_PROMPT
    },
        *recent_messages,
    ]
    payload = {
        "model":MODEL_NAME,
        "messages": ollama_messages,
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