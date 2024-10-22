from flask import Blueprint, request, jsonify
from langchain.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
#from langchain_redis import RedisChatMessageHistory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain.schema import HumanMessage, AIMessage


import redis
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

chatpdf_bp = Blueprint('chatpdf', __name__)
def get_conversational_chain():

    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """

    model = ChatGoogleGenerativeAI(model="gemini-pro",
                             temperature=0.3)

    prompt = PromptTemplate(template = prompt_template, input_variables = ["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    return chain

redis_urll = "redis://localhost:6380"  # Use this URL for local Redis

history = RedisChatMessageHistory(
    url=redis_urll, ttl=500, session_id="chat2"
)

# Initialize model, prompt, memory, and chain
model = ChatGroq(
    temperature=1.0,
    groq_api_key="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",
    model="mixtral-8x7b-32768",
)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a friendly AI assistant."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True,
    chat_memory=history,
)

chain = LLMChain(
    llm=model,
    prompt=prompt,
    verbose=True,
    memory=memory
)

def store_in_redis(history, role, content):
    """Store question-answer pairs in Redis."""
    if role == "human":
        message = HumanMessage(content=content)
    else:
        message = AIMessage(content=content)

    history.add_message(message)


def get_response(input_text):
    inp = input_text
    q = {"input": inp}
    response = chain.invoke(q)
    return response["text"]


@chatpdf_bp.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question')
    print(question)

    if not question:
        return jsonify({'error': 'No question provided'}), 400

   
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(question)
    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": question}, return_only_outputs=True)
    ress = response["output_text"]

    if ress != "Answer is not available in the context":
        store_in_redis(history, "human", question)
        store_in_redis(history, "ai", ress)
        return jsonify({"answer": ress}), 200

    # If the answer isn't in the context, fetch from Redis history or fallback
    fallback_response = get_response(question)
    store_in_redis(history, "human", question)
    store_in_redis(history, "ai", fallback_response)
    return jsonify({"answer": fallback_response}), 200

