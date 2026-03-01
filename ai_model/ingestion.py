import os
import torch
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {DEVICE}")

print("Loading PDFs...")
loader = DirectoryLoader(
    "data/",
    glob="**/*.pdf",
    loader_cls=PyPDFLoader
)
documents = loader.load()
print(f"Loaded {len(documents)} documents")

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
docs = text_splitter.split_documents(documents)
print(f"Split into {len(docs)} chunks")

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": DEVICE},
    encode_kwargs={"normalize_embeddings": True}
)
print("Embedding model loaded successfully")

# Aggressively sanitize every text chunk
clean_texts = []
skipped = 0
for i, doc in enumerate(docs):
    try:
        content = doc.page_content
        if not content or not isinstance(content, str):
            skipped += 1
            continue
        # Re-encode to strip any corrupt/non-UTF-8 bytes
        cleaned = content.encode("utf-8", errors="ignore").decode("utf-8").strip()
        if cleaned:
            clean_texts.append(cleaned)
        else:
            skipped += 1
    except Exception as e:
        print(f"Skipped chunk {i} due to error: {e}")
        skipped += 1

print(f"Clean texts ready: {len(clean_texts)} | Skipped: {skipped}")

print("Generating embeddings & building FAISS index...")
db = FAISS.from_texts(clean_texts, embeddings)

os.makedirs("faiss_index", exist_ok=True)
db.save_local("faiss_index")
print("✅ FAISS index saved successfully")