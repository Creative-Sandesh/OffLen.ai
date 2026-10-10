<div align="center">

# 📚 DocuMind AI

### Intelligent Document Question Answering with RAG

**Upload documents. Ask questions. Get context-aware answers powered by local AI.**

<br/>

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-000000?style=for-the-badge&logo=ollama&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_DB-FF6B35?style=for-the-badge)
![RAG](https://img.shields.io/badge/AI-RAG-8A2BE2?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

**FastAPI · React · TypeScript · Ollama · Embeddings · Vector Search · RAG**

</div>

---

## ✨ Overview

**DocuMind AI** is an AI-powered document question-answering application built using **Retrieval-Augmented Generation (RAG)**.

Instead of asking a Large Language Model to answer questions only from its pretrained knowledge, DocuMind retrieves relevant information directly from an uploaded document and provides that context to a locally running LLM.

This helps generate answers that are more:

- 🎯 Relevant
- 📄 Document-aware
- 🔍 Context-grounded
- 🔒 Privacy-friendly
- 🧠 Intelligent

The project demonstrates how modern **AI systems, vector databases, semantic search, backend APIs, and frontend applications** can be integrated into one complete system.

---

# 🚀 Features

### 📤 Document Upload

Upload a supported document through the web interface.

The backend processes the document and prepares it for semantic retrieval.

### ✂️ Intelligent Chunking

Large document content is divided into smaller chunks so that relevant information can be retrieved efficiently.

### 🧠 Embedding Generation

Each document chunk is transformed into a numerical vector representation using an embedding model.

### 🗄️ Vector Storage

Generated embeddings and their associated document chunks are stored inside a vector database for fast semantic search.

### 🔎 Semantic Retrieval

When a user asks a question, the application converts the query into an embedding and retrieves the most semantically relevant document chunks.

### 🤖 RAG-Powered Answers

Retrieved chunks are supplied to the LLM as context before generating the final response.

### 💬 Interactive Chat Interface

A modern React frontend provides a simple conversational interface for asking questions about uploaded documents.

### 🔐 Local AI Processing

The LLM can run locally using **Ollama**, reducing dependency on external AI APIs and improving privacy.

---

# 🧠 How RAG Works

```text
                     ┌─────────────────────┐
                     │   Upload Document   │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   Extract Content   │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   Split Into Chunks │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │ Generate Embeddings │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │    Vector Store     │
                     │     ChromaDB        │
                     └──────────┬──────────┘
                                │
                                │
              User Question     │
                    │           │
                    ▼           │
          ┌───────────────────┐ │
          │ Query Embedding   │ │
          └─────────┬─────────┘ │
                    │           │
                    ▼           ▼
             ┌──────────────────────┐
             │   Similarity Search  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Relevant Doc Chunks  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Build RAG Prompt     │
             │ Context + Question   │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │     Ollama LLM       │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │   Final AI Answer    │
             └──────────────────────┘
```

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────────────────────────┐
│                    FRONTEND                               │
│                                                         │
│              React + TypeScript                         │
│                                                         │
│   ┌───────────────┐            ┌──────────────────┐     │
│   │ Document      │            │ Chat Interface   │     │
│   │ Upload        │            │                  │     │
│   └───────┬───────┘            └────────┬─────────┘     │
│           │                              │               │
└───────────┼──────────────────────────────┼───────────────┘
            │                              │
            │          REST API            │
            ▼                              ▼
┌───────────────────────────────────────────────────────────┐
│                     BACKEND                               │
│                                                         │
│                     FastAPI                             │
│                                                         │
│  ┌───────────────┐               ┌─────────────────┐    │
│  │ Document API  │               │    Chat API     │    │
│  └───────┬───────┘               └────────┬────────┘    │
│          │                                │              │
│          ▼                                ▼              │
│  ┌───────────────┐               ┌─────────────────┐    │
│  │ Document      │               │ Retrieval       │    │
│  │ Processing    │               │ Service         │    │
│  └───────┬───────┘               └────────┬────────┘    │
│          │                                │              │
│          ▼                                ▼              │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Embedding Service                   │   │
│  └────────────────────────┬─────────────────────────┘   │
│                           │                             │
└───────────────────────────┼─────────────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │    ChromaDB     │
                   │  Vector Store   │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │     Ollama      │
                   │    Local LLM    │
                   └─────────────────┘
```

---

# 🔄 Application Flow

## 1. Upload Document

```text
User
 ↓
React Frontend
 ↓
POST /documents/upload
 ↓
FastAPI
 ↓
Document Processing
```

The uploaded document is validated and its textual content is extracted.

---

## 2. Chunk Document

```text
Document
   ↓
Text Extraction
   ↓
Chunking
   ↓
Chunk 1
Chunk 2
Chunk 3
...
```

Breaking large documents into smaller sections improves retrieval accuracy.

---

## 3. Generate Embeddings

```text
Document Chunk
      ↓
Embedding Model
      ↓
Vector
```

Example representation:

```text
"Machine learning is a branch of artificial intelligence."

                ↓

[0.021, -0.182, 0.334, 0.091, ...]
```

These vectors represent the semantic meaning of the text.

---

## 4. Store Embeddings

```text
Chunk
  +
Embedding
  +
Metadata
  ↓
ChromaDB
```

Metadata can include information such as:

```json
{
  "document_id": "document-uuid",
  "chunk_index": 4
}
```

---

## 5. User Asks a Question

Example:

```text
"What is the main objective discussed in this document?"
```

The frontend sends the question and selected document ID to the backend.

---

## 6. Generate Query Embedding

```text
Question
   ↓
Embedding Model
   ↓
Query Vector
```

The query embedding and document chunk embeddings exist within the same vector space.

---

## 7. Retrieve Relevant Chunks

The query vector is compared against stored document embeddings.

```text
Query Vector
      ↓
Vector Similarity Search
      ↓
Top K Relevant Chunks
```

For example:

```text
Chunk 12 → similarity: 0.93
Chunk 7  → similarity: 0.89
Chunk 21 → similarity: 0.85
```

---

## 8. Construct RAG Context

The retrieved information is combined with the user's question.

```text
SYSTEM INSTRUCTION

        +

RETRIEVED DOCUMENT CONTEXT

        +

USER QUESTION

        ↓

FINAL PROMPT
```

---

## 9. LLM Generates the Answer

```text
RAG Prompt
   ↓
Ollama
   ↓
Local LLM
   ↓
Generated Answer
```

The response is returned through FastAPI to the React interface.

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Build Tool | Vite |
| Backend | FastAPI |
| Backend Language | Python |
| API Architecture | REST |
| Validation | Pydantic |
| AI Runtime | Ollama |
| AI Architecture | Retrieval-Augmented Generation |
| Embeddings | Text Embedding Model |
| Vector Database | ChromaDB |
| HTTP Client | HTTPX |
| Document Retrieval | Semantic Similarity Search |

---

# 📁 Project Structure

```text
project/
│
├── backend/
│   │
│   ├── app/
│   │   │
│   │   ├── main.py
│   │   │
│   │   ├── api/
│   │   │   ├── chat.py
│   │   │   └── documents.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── chat.py
│   │   │   └── document.py
│   │   │
│   │   ├── services/
│   │   │   ├── embedding_service.py
│   │   │   ├── retrieval_service.py
│   │   │   ├── vector_store_service.py
│   │   │   ├── document_service.py
│   │   │   └── ollama_service.py
│   │   │
│   │   └── core/
│   │       └── config.py
│   │
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── ChatBox.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── DocumentUpload.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── types/
│   │   │   └── chat.ts
│   │   │
│   │   ├── App.tsx
│   │   │
│   │   └── main.tsx
│   │   │
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── README.md
│
└── README.md
```

> The exact structure may evolve as new RAG capabilities are added.

---

# ⚙️ Installation

## Prerequisites

Make sure the following tools are installed:

```text
Python 3.11+
Node.js 18+
npm
Git
Ollama
```

---

# 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

---

# 2️⃣ Backend Setup

Move into the backend directory:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend should now be available at:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

---

# 3️⃣ Ollama Setup

Install Ollama and download the LLM used by the project.

Example:

```bash
ollama pull llama3.2
```

Run Ollama:

```bash
ollama serve
```

Verify the model:

```bash
ollama run llama3.2
```

---

# 4️⃣ Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🌐 API Overview

## Documents API

### Upload Document

```http
POST /documents/upload
```

Uploads and processes a new document.

---

### Get Documents

```http
GET /documents
```

Returns available documents.

---

### Get Document

```http
GET /documents/{document_id}
```

Returns information about a specific document.

---

### Delete Document

```http
DELETE /documents/{document_id}
```

Deletes the selected document and associated data.

---

## Chat API

### Ask Question

```http
POST /chat
```

Example request:

```json
{
  "document_id": "document-id",
  "message": "What is this document mainly about?"
}
```

Example response:

```json
{
  "answer": "The document primarily discusses..."
}
```

---

# 🧩 Core Services

### `document_service.py`

Responsible for document processing tasks such as:

```text
Upload
   ↓
Validation
   ↓
Text Extraction
   ↓
Chunking
```

---

### `embedding_service.py`

Converts document chunks and user queries into embedding vectors.

```python
generate_query_embedding(query)
```

---

### `vector_store_service.py`

Handles interaction with the vector database.

Responsibilities include:

```text
Store Embeddings
Retrieve Embeddings
Similarity Search
Filter by Document
Delete Document Vectors
```

---

### `retrieval_service.py`

Connects the query embedding system with the vector database.

Typical flow:

```text
Question
   ↓
generate_query_embedding()
   ↓
search_chunks()
   ↓
Relevant Context
```

---

### `ollama_service.py`

Handles communication between FastAPI and the locally running Ollama LLM.

```text
FastAPI
   ↓
Ollama Service
   ↓
Ollama API
   ↓
LLM
```

---

# 🧠 Why RAG?

A traditional LLM answers questions using knowledge acquired during training.

That creates a problem when the information is:

- Private
- Newly created
- Organization-specific
- Inside uploaded documents
- Not present in the model's training data

RAG solves this problem by retrieving external information before generating an answer.

### Traditional LLM

```text
Question
   ↓
LLM
   ↓
Answer
```

### RAG

```text
Question
   ↓
Retrieve Relevant Knowledge
   ↓
Add Knowledge to Prompt
   ↓
LLM
   ↓
Grounded Answer
```

---

# 🔒 Privacy

One of the key objectives of this project is supporting a **local-first AI architecture**.

Using Ollama allows the language model to run locally rather than sending every prompt to a third-party cloud LLM.

```text
Your Document
      ↓
Your Backend
      ↓
Your Vector Database
      ↓
Local Ollama Model
```

This architecture is especially useful for applications involving:

- Internal company documents
- Academic material
- Research papers
- Sensitive documentation
- Private knowledge bases

---

# 🎯 Project Objectives

This project was developed to explore and implement several important concepts in modern AI engineering:

- Retrieval-Augmented Generation
- Large Language Model integration
- Semantic search
- Text embeddings
- Vector databases
- Prompt construction
- REST API development
- Asynchronous backend development
- Document processing
- React frontend development
- Local LLM deployment
- AI system architecture

---

# 🗺️ Development Roadmap

### ✅ Phase 1 — LLM Integration

- [x] FastAPI project setup
- [x] Chat API
- [x] Pydantic validation
- [x] Ollama integration
- [x] Local LLM communication

### ✅ Phase 2 — RAG Pipeline

- [x] Document upload
- [x] Document processing
- [x] Text chunking
- [x] Embedding generation
- [x] Vector storage
- [x] Query embeddings
- [x] Semantic retrieval
- [x] Document-specific filtering
- [x] Context retrieval

### 🚧 Phase 3 — Complete RAG Chat

- [ ] Context-aware prompt generation
- [ ] Source-aware responses
- [ ] Improved retrieval ranking
- [ ] Conversation history
- [ ] Hallucination reduction
- [ ] Citation support

### 🔮 Future Improvements

- [ ] Multiple document chat
- [ ] Streaming responses
- [ ] Hybrid search
- [ ] Reranking
- [ ] User authentication
- [ ] Chat sessions
- [ ] Persistent conversation history
- [ ] Docker support
- [ ] Production deployment
- [ ] Evaluation pipeline
- [ ] Retrieval quality metrics
- [ ] Response feedback system
- [ ] Advanced document metadata filtering

---

# 📊 RAG Pipeline Summary

| Stage | Input | Process | Output |
|---|---|---|---|
| 1 | Document | Upload | Raw Document |
| 2 | Document | Text Extraction | Text |
| 3 | Text | Chunking | Chunks |
| 4 | Chunks | Embedding Model | Vectors |
| 5 | Vectors | Vector Storage | Knowledge Base |
| 6 | Question | Query Embedding | Query Vector |
| 7 | Query Vector | Similarity Search | Relevant Chunks |
| 8 | Chunks + Question | Prompt Construction | RAG Prompt |
| 9 | RAG Prompt | Ollama LLM | Final Answer |

---

# 💡 Example

Suppose a user uploads a machine learning document containing:

```text
Random Forest is an ensemble learning algorithm that combines
multiple decision trees to improve predictive performance.
```

The user asks:

```text
What is Random Forest?
```

### Retrieval

The application searches the vector database and retrieves the relevant passage.

```text
Random Forest is an ensemble learning algorithm that combines
multiple decision trees...
```

### Augmented Prompt

```text
Use the following document context to answer the question.

Context:
Random Forest is an ensemble learning algorithm that combines
multiple decision trees to improve predictive performance.

Question:
What is Random Forest?
```

### Generated Response

```text
Random Forest is an ensemble machine-learning algorithm that combines
predictions from multiple decision trees to improve accuracy and
generalization.
```

That is the core idea behind **Retrieval-Augmented Generation**.

---

# 🧪 Testing the Backend

FastAPI automatically provides Swagger documentation.

After starting the backend, open:

```text
http://localhost:8000/docs
```

From there you can test:

```text
Document Upload
Document Listing
Document Retrieval
Document Deletion
Chat
RAG Retrieval
```

without needing the frontend.

---

# 📈 What I Learned

Building this project provided practical experience with:

```text
Python Backend Engineering
         +
FastAPI
         +
REST APIs
         +
React + TypeScript
         +
LLM Integration
         +
Ollama
         +
Embeddings
         +
Vector Databases
         +
Semantic Search
         +
RAG
         =
AI Systems Engineering
```

It demonstrates that building an AI application involves much more than simply calling an LLM.

A complete AI system requires careful integration of **data processing, retrieval, storage, backend services, model inference, APIs, and user interfaces**.

---

# 🤝 Contributing

Contributions, ideas, and improvements are welcome.

```bash
# Fork the repository

# Create a new branch
git checkout -b feature/new-feature

# Commit your changes
git commit -m "Add new feature"

# Push your branch
git push origin feature/new-feature
```

Then open a Pull Request.

---

# 👨‍💻 Author

<div align="center">

### Sandesh Bohara

**AI / Machine Learning · Python Backend · AI Systems Engineering**

[![GitHub](https://img.shields.io/badge/GitHub-Creative--Sandesh-181717?style=for-the-badge&logo=github)](https://github.com/Creative-Sandesh)

<br/>

*Building intelligent systems one project at a time.*

</div>

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a **⭐ Star**.

It helps support the project and encourages further development.

---

<div align="center">

### 🧠 Built with RAG · ⚡ Powered by FastAPI · 🤖 Running on Ollama

**Made by [Sandesh Bohara](https://github.com/Creative-Sandesh)**

</div>