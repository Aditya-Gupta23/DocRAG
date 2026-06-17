from langchain_groq import ChatGroq
from langchain_core.messages import (HumanMessage,AIMessage,SystemMessage)
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm=ChatGroq(model="llama-3.3-70b-versatile")

def generate_answer(question,context,chat_history):
    messages=[
        SystemMessage(
            content="""
                You are a helpful RAG assistant.
                Rules:
                1. Answer only using the provided context.
                2. Use the chat history to understand references such as
                'it', 'that feature', 'the second point', etc.
                3. If the answer is not present in the context,
                say that the information is not available.
                4. Do not hallucinate.
            """
        )
    ]

    for message in chat_history:
        if message['role']=='user':
            messages.append(HumanMessage(content=message['content']))
        elif message['role']=='assistant':
            messages.append(AIMessage(content=message['content']))

    messages.append(
        HumanMessage(
            content=f"""
Context:
{context}

Question:
{question}
            """
        )
    )
    response = llm.invoke(messages)
    return response.content