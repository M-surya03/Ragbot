from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from chatbot import generate_response
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    question: str



@app.post("/ask")
async def ask(query: Query):

    async def stream():
        print("Received question:", query.question)

        answer = generate_response(query.question)

        for token in answer.split():
            yield token + " "
            await asyncio.sleep(0.02)

    return StreamingResponse(stream(), media_type="text/plain")


@app.post("/generate-title")
def generate_title(query: Query):

    prompt = f"""
You are a title generator.

Return ONLY a short professional chat title.
Maximum 5 words.
NO explanation.
NO extra text.
NO quotes.
NO punctuation at the end.
Only the title text.

User message:
{query.question}
"""

    title = generate_response(prompt)


    cleaned_title = title.split("\n")[0].strip()
    cleaned_title = cleaned_title.replace('"', '').replace("'", "")
    cleaned_title = cleaned_title.strip()


    cleaned_title = " ".join(cleaned_title.split()[:5])

    if not cleaned_title:
        cleaned_title = "New Chat"

    return {"title": cleaned_title}