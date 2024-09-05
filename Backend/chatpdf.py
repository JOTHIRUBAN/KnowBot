from flask import Blueprint, request, jsonify
from langchain.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
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

    chain = get_conversational_chain()  # Assume this is defined elsewhere in your code
    response = chain({"input_documents": docs, "question": question}, return_only_outputs=True)

    return jsonify({'answer': response["output_text"]}), 200
