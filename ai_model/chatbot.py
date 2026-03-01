import re
import uuid
import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForCausalLM
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from sklearn.metrics.pairwise import cosine_similarity

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────

MODEL_PATH = "models/mistral_7b_4bit"
PINECONE_API_KEY = "pcsk_si4i7_66LEKkppYbBENJB7sykhxRf8WKtwffrGmw9Mf1fEDfYpgSM9D46puthfSxQeSAq"
PINECONE_INDEX = "college-rag"

# ─────────────────────────────────────────────
# LOAD MODEL
# ─────────────────────────────────────────────

print("Loading local model...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH,
    device_map="cuda:0" if torch.cuda.is_available() else "cpu"
)

print("✅ Model Loaded")

# ─────────────────────────────────────────────
# LOAD FAISS
# ─────────────────────────────────────────────

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": "cuda" if torch.cuda.is_available() else "cpu"},
)

vector_store = FAISS.load_local(
    "faiss_index",
    embeddings,
    allow_dangerous_deserialization=True
)

# ─────────────────────────────────────────────
# PINECONE — CONVERSATION MEMORY
# ─────────────────────────────────────────────

pc = Pinecone(api_key=PINECONE_API_KEY)
pinecone_index = pc.Index(PINECONE_INDEX)

embed_model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2",
    device="cuda" if torch.cuda.is_available() else "cpu"
)

def store_conversation(user_query: str, assistant_response: str):
    text = f"User: {user_query}\nAssistant: {assistant_response}"
    vector = embed_model.encode(text).tolist()
    pinecone_index.upsert(
        vectors=[{
            "id": str(uuid.uuid4()),
            "values": vector,
            "metadata": {"text": text}
        }]
    )

def retrieve_memory(query: str, top_k: int = 2) -> str:
    vector = embed_model.encode(query).tolist()
    results = pinecone_index.query(
        vector=vector,
        top_k=top_k,
        include_metadata=True
    )
    memories = [m["metadata"]["text"] for m in results["matches"]]
    return "\n\n".join(memories) if memories else ""

# ─────────────────────────────────────────────
# RELEVANCE CHECK
# ─────────────────────────────────────────────

def is_context_relevant(query: str, docs: list, threshold: float = 0.45) -> bool:
    if not docs:
        return False
    query_embedding = embeddings.embed_query(query)
    doc_embeddings = [embeddings.embed_query(doc.page_content) for doc in docs]
    similarities = cosine_similarity([query_embedding], doc_embeddings)[0]
    return float(np.max(similarities)) >= threshold

# ─────────────────────────────────────────────
# GREETING HANDLER
# ─────────────────────────────────────────────

GREETINGS = [
    "hi", "hello", "hey", "good morning", "good afternoon",
    "good evening", "howdy", "greetings", "what's up", "sup"
]

def is_greeting(query: str) -> bool:
    return query.strip().lower() in GREETINGS

GREETING_RESPONSE = (
    "Hello! 👋 I'm Syllabex, your Controlled Academic Learning Assistant.\n\n"
    "I help you understand concepts from your approved syllabus materials — "
    "not by giving exam answers, but by making sure you truly understand.\n\n"
    "Ask me something like:\n"
    "• What is cloud computing?\n"
    "• Explain TCP/IP\n"
    "• Differentiate RAM and ROM\n"
)

# ─────────────────────────────────────────────
# SYSTEM PROMPT
# ─────────────────────────────────────────────

SYSTEM_PROMPT = """You are Syllabex, a controlled AI learning assistant.
You help students understand concepts clearly and simply.
Do not write direct exam answers. Focus on explanation and understanding.
"""

# ─────────────────────────────────────────────
# PROMPT TEMPLATES
# ─────────────────────────────────────────────

RAG_PROMPT = """{system}

## PREVIOUS CONVERSATION MEMORY
{memory}

---

## CONTEXT (Syllabus Material)
{context}

---

STUDENT QUESTION: {query}

ANSWER:"""

GENERAL_PROMPT = """{system}

## PREVIOUS CONVERSATION MEMORY
{memory}

---

STUDENT QUESTION:
{query}

ANSWER:"""

# ─────────────────────────────────────────────
# TOKEN LIMIT (UPDATED — IMPORTANT FIX)
# ─────────────────────────────────────────────

def get_max_tokens(query: str) -> int:
    q = query.lower()
    if any(k in q for k in ["differentiate", "compare", "distinguish", "contrast"]):
        return 400
    elif "15" in q or "fifteen" in q:
        return 1024   # reduced
    elif "13" in q or "thirteen" in q:
        return 700    # reduced
    elif "assignment" in q:
        return 800
    else:
        return 300

# ─────────────────────────────────────────────
# OUTPUT CLEANER
# ─────────────────────────────────────────────

def clean_output(text: str) -> str:
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    text = re.sub(r'https?://\S+', '', text)
    text = re.sub(r'Figure\s*\d+:.*?\n', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

# ─────────────────────────────────────────────
# MAIN RESPONSE GENERATOR
# ─────────────────────────────────────────────

def generate_response(query: str) -> str:

    if is_greeting(query):
        return GREETING_RESPONSE

    memory = retrieve_memory(query)

    docs = vector_store.similarity_search(query, k=3)

    if is_context_relevant(query, docs, threshold=0.45):
        context = "\n\n".join([doc.page_content for doc in docs])
        prompt = RAG_PROMPT.format(
            system=SYSTEM_PROMPT,
            memory=memory,
            context=context,
            query=query
        )
    else:
        prompt = GENERAL_PROMPT.format(
            system=SYSTEM_PROMPT,
            memory=memory,
            query=query
        )

    inputs = tokenizer(prompt, return_tensors="pt")
    inputs = {k: v.to(model.device) for k, v in inputs.items()}

    print("Generating response... max tokens:", get_max_tokens(query))

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=get_max_tokens(query),
            do_sample=True,
            temperature=0.2,
            repetition_penalty=1.1,
            pad_token_id=tokenizer.eos_token_id
        )

    input_len = inputs["input_ids"].shape[1]
    raw_output = tokenizer.decode(outputs[0][input_len:], skip_special_tokens=True)
    response = clean_output(raw_output)

    print("Generation done. Response length:", len(response))

    store_conversation(query, response)

    return response

# ─────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
def ask(query: Query):
    print("Received question:", query.question)
    answer = generate_response(query.question)
    print("Sending answer length:", len(answer))
    return {"answer": answer}