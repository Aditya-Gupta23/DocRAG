from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from rag.config import(CHROMA_PATH,COLLECTION_NAME)

embeddings=HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

db=Chroma(
    persist_directory=CHROMA_PATH,
    embedding_function=embeddings,
    collection_name=COLLECTION_NAME
)

def retrieve_documents(query, chat_id ,k=4):
    return db.max_marginal_relevance_search(query, k=k,fetch_k=10,filter={"chat_id":str(chat_id)})