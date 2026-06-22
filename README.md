# DocRAG

DocRAG is a production-style Retrieval Augmented Generation (RAG) application that enables users to upload PDF documents and interact with them through natural language conversations.

The system combines Hybrid Retrieval, Query Rewriting, Structured Context Construction, and Source Citations to improve answer quality, grounding, and conversational understanding.

Users can create accounts, maintain multiple chats, upload PDFs independently for each chat, and continue conversations with persistent chat history.

---

## Features

### Hybrid Retrieval

DocRAG implements a hybrid retrieval pipeline combining:

* Maximum Marginal Relevance (MMR)
* BM25 Keyword Retrieval
* Deduplication of retrieved chunks
* Structured Context Construction

This improves:

* Exact keyword matching
* Entity and name retrieval
* Section and article references
* Multi-page reasoning
* Retrieval diversity

---

### Query Rewriting

DocRAG rewrites follow-up conversational questions into standalone questions before retrieval.

Example:

Input:

```text
What about the second point?
```

Rewritten:

```text
What is the second point of the NATO response?
```


This significantly improves retrieval quality in multi-turn conversations.

---

### Structured Context Construction

Retrieved chunks are transformed into:

```text
Source: report.pdf

Page: 3

Content:

...

--------------------------------
```

This improves:

* Hallucination resistance
* Source grounding
* Multi-page understanding
* Citation quality
* Context organization

---

### Source Citations

Every generated answer includes:

* Source PDF filename
* Page number
* Original document references

This provides transparent and grounded responses.

---

### Multi-Chat Architecture

* Multiple independent chats
* Chat-specific document retrieval
* Persistent chat history
* Continue previous conversations
* Independent PDF uploads per chat

---

### PDF Processing

* PDF Upload
* Automatic Text Extraction
* Recursive Chunking
* Metadata Storage
* Chroma Vector Storage
* Automatic File Cleanup

---

### Authentication

* User Registration
* User Login
* JWT Authentication
* Access Token
* Refresh Token
* Protected API Endpoints
* Persistent Sessions

---

### Automatic Cleanup

Deleting a chat automatically removes:

* Chat Messages
* Uploaded PDFs
* Chroma Embeddings
* Database Records

---

## Architecture

Question

↓

Query Rewriter

(DeepSeek V4 Pro)

↓

Hybrid Retrieval

MMR + BM25

↓

Merge and Deduplicate

↓

Structured Context Construction

↓

LLM

Llama 3.3 70B via Groq

↓

Answer + Source Citations

---

## Tech Stack

### Backend

* Django
* Django REST Framework
* SimpleJWT
* LangChain
* ChromaDB
* HuggingFace Embeddings
* Groq API

### Frontend

* React (Vite)
* Tailwind CSS
* Zustand
* Axios
* React Router DOM
* React Markdown
* React Hot Toast

### Retrieval

* Maximum Marginal Relevance (MMR)
* BM25 Retrieval
* Hybrid Retrieval
* Structured Context

---

## Embedding Model

```text
sentence-transformers/all-MiniLM-L6-v2
```
Running Locally:

```text
downloaded from  Huggingface
```

---

## Query Rewriting Model

```text
deepseek-ai/DeepSeek-V4-Pro
```

Served using:

```text
Huggingface Inference API
```
---

## Generation Model

```text
llama-3.3-70b-versatile
```

Served using:

```text
Groq API
```

---

## Folder Structure

```text
backend/

chat/
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── signals.py
├── apps.py

rag/
├── config.py
├── ingest.py
├── retriever.py
├── bm25_retriever.py
├── rewriter.py
├── llm.py
├── query.py

core/
├── settings.py
├── urls.py

media/
└── uploads/

chroma_db/

frontend/

src/
├── components/
├── pages/
├── store/
├── services/
├── App.jsx
└── main.jsx
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Aditya-Gupta23/DocRAG.git

cd DocRAG
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

Create:

```text
.env
```

Add:

```text
GROQ_API_KEY=your_key

HF_TOKEN=your_token
```

Run:

```bash
python manage.py migrate

python manage.py runserver
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## API Endpoints

### Authentication

```text
POST /api/register/

POST /api/login/

POST /api/refresh/
```

---

### Chats

```text
GET    /api/chats/

POST   /api/chats/

DELETE /api/chats/<id>/
```

---

### Upload PDF

```text
POST /api/chats/<id>/upload/
```

---

### Ask Questions

```text
POST /api/chats/<id>/message/
```

---

## Future Improvements

* Cross-document Retrieval
* OCR Support
* Streaming Responses
* Multi-file Chat
* Table Extraction
* Reranking Models
* Document Summarization

---

## Author

Aditya Gupta

B.Tech Computer Science and Engineering

Indian Institute of Information Technology Kottayam
