from flask import Blueprint, request, jsonify, session
import google.generativeai as genai
import os
import pytesseract
from PIL import Image
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain.schema import Document

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API"))

chatimg_bp = Blueprint('chatimg', __name__)

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible r\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """

    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.7)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    return chain

@chatimg_bp.route('/askimg', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question')
    print(question)

    if not question:
        return jsonify({'error': 'No question provided'}), 400
    if 'text' not in session:
        print("Session data:", session)  # Debugging statement
        return jsonify({'error': 'No text found in session'}), 400
    
    text = session['text']
    docs = [Document(page_content=text, metadata={})]  # Convert text to a list of Document objects
    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": question}, return_only_outputs=True)

    return jsonify({'answer': response["output_text"]}), 200

@chatimg_bp.route('/uploadimg', methods=['POST'])
def upload_img():
    if 'img' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    img = request.files['img']

    if img.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    Img = Image.open(img)
    text = pytesseract.image_to_string(Img)
    print("Extracted text:", text)  # Debugging statement

    if text == '':
        return jsonify({'error': 'No text found in the image'}), 400

    session['text'] = text
    print("Session data set:", session)  # Debugging statement

    return jsonify({'message': 'Image processed successfully'}), 200