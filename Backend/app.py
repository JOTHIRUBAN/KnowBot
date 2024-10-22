from flask import Flask, request, jsonify
from flask_cors import CORS
from auth import auth_bp
from bot import get_response  
from youtube import youtube_bp  # Import the youtube blueprint
from pdfhandle import pdf_bp  # Import the pdf blueprint
from chatpdf import chatpdf_bp
from chatimg import chatimg_bp
from feed import feed_bp
app = Flask(__name__)
CORS(app,supports_credentials=True)
app.config['MAX_CONTENT_LENGTH'] = 45 * 1024 * 1024  # Limit to 45 MB
app.secret_key = 'your_secret_key'
# Register the authentication blueprint
app.register_blueprint(auth_bp, url_prefix='/api/')

# Register the youtube blueprint
app.register_blueprint(youtube_bp, url_prefix='/api/')

# Register the PDF blueprint
app.register_blueprint(pdf_bp, url_prefix='/api/')

#Register the chat-pdf blueprint
app.register_blueprint(chatpdf_bp, url_prefix='/api/')

app.register_blueprint(chatimg_bp, url_prefix='/api/')

#Register the feed blueprint
app.register_blueprint(feed_bp,url_prefix='/')
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('question', '')
    
    if not user_input:
        return jsonify({"error": "No question provided"}), 400

    answer = get_response(user_input)
    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(debug=True)
