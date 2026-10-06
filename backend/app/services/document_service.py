from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile, HTTPException
from pypdf import PdfReader

from app.services.chunking_service import chunk_text

DOCUMENT_DIR = Path("app/data/documents")

DOCUMENT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".txt"
}

MAX_FILE_SIZE = 10 * 1024 * 1024

async def process_document(file: UploadFile):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required.")
    extension = Path(file.filename).suffix.lower()
    
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported.")
    
    file_content = await file.read()
    
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size must be less than 10 MB.")
    
    if len(file_content) ==0:
        raise HTTPException( status_code=400, detail="Uploaded file is empty.")
    
    document_id = str(uuid4())

    saved_filename = f"file{document_id}{extension}"
    file_path = DOCUMENT_DIR/saved_filename
    
    with open(file_path, "wb") as saved_file:
        saved_file.write(file_content)
    try:
        if extension == ".pdf":
            text = extract_pdf_text(file_path)
        elif extension == ".txt":
            text = extract_txt_text(file_path)
        
        else:
            text = ""
    
    except Exception:
        file_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=422, detail="Unable to extract text from document."
        )
    
    if not text.strip():
        file_path.unlink(missing_ok=True)

        raise HTTPException(status_code=422, detail="No readable text found in document.")
    chunks = chunk_text(
        text=text,
        document_id=document_id
    )
    for chunk in chunks[:3]:
        print(
            "\nCHUNK:",
            chunk["chunk_index"],
            "\n",
            chunk["text"]
        )
    return{
        "document_id": document_id,
        "filename": file.filename,
        "content_type": file.content_type or "unknown",
        "characters": len(text),
        "chunks": chunks,
        "status": "processed",
        "text": text
        
    }
    
def extract_pdf_text(file_path: Path) -> str:
    reader = PdfReader(file_path)

    pages =[]
    
    for page in reader.pages:
        page_text = page.extract_text()
        
        if page_text:
            pages.append(page_text)
    
    return "\n\n".join(pages)

def extract_txt_text(file_path: Path) ->str:
    return file_path.read_text(encoding="utf-8")
    
    
    
    
    
    
    
    
    