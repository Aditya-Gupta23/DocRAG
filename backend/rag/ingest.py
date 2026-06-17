from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings  
from langchain_chroma import Chroma
from rag.config import CHROMA_PATH, COLLECTION_NAME
import os

embeddings=HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def ingest_pdf(pdf_path):
    source = os.path.basename(pdf_path)
    loader=PyPDFLoader(pdf_path)
    documents=loader.load()
    splitter=RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )
    chunks=splitter.split_documents(documents)
    for chunk in chunks:
        chunk.metadata["source"]=source

    db=Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings,
        collection_name=COLLECTION_NAME
    )
    #removing duplicate upload
    db.delete(
        where={"source": source}
    )

    db.add_documents(chunks)
    return len(chunks)