from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Enable CORS so your React app can talk to this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("ILMU_API_KEY"), base_url="https://api.ilmu.ai/v1")

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    if len(request.message) > 500: # Adjust based on your limit
        return {"reply": "That message is too long! Please keep it brief so I can help you better."}

    try:
        response = client.chat.completions.create(
            model="ilmu-glm-5.1",
            messages=[{"role": "user", "content": request.message}],
            timeout=60.0
        )
        return {"reply": response.choices[0].message.content}
    
    except Exception as e:
        if "maximum context length" in str(e).lower():
            return {"reply": "I'm sorry, that was too much information for me to process. Can you summarize it?"}
        return {"error": "Server error. Please try a shorter message."}

if __name__ == "__main__":
    import uvicorn
    print("--- SyncBite Backend Starting ---")
    print("Server is running at http://localhost:8000")
    # This command actually starts the server
    uvicorn.run(app, host="0.0.0.0", port=8000)