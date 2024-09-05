from flask import Blueprint, request, jsonify
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
import os
from dotenv import load_dotenv

pdf_bp = Blueprint('pdf', __name__)
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Function to process the PDF
def process_pdf(pdf_file):
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    return text_splitter.split_text(text)

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

@pdf_bp.route('/upload', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    pdf_file = request.files['pdf']

    if pdf_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    text = process_pdf(pdf_file)
    text_chunks = get_text_chunks(text)
    get_vector_store(text_chunks)

    return jsonify({'message': 'PDF processed successfully'}), 200
