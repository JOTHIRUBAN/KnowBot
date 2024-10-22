from flask import Blueprint, request, jsonify
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS  # Updated import
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
        page_text = page.extract_text() or ""  # Handle None case
        text += page_text
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    return text_splitter.split_text(text)

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    if not text_chunks:
        raise ValueError("No text chunks available for embedding.")

    # Create vector store
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

@pdf_bp.route('/upload', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    pdf_file = request.files['pdf']

    if pdf_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        text = process_pdf(pdf_file)
        if not text.strip():  # Check if text is empty
            return jsonify({'error': 'No text extracted from the PDF'}), 400
        
        text_chunks = get_text_chunks(text)
        
        # Check if there are any text chunks after splitting
        if not text_chunks:
            return jsonify({'error': 'No text chunks created from the PDF'}), 400
        
        get_vector_store(text_chunks)

        return jsonify({'message': 'PDF processed successfully'}), 200

    except Exception as e:
        # Log the error message for debugging purposes (optional)
        print(f"Error processing PDF: {e}")
        return jsonify({'error': f"Failed to process PDF: {str(e)}"}), 500
