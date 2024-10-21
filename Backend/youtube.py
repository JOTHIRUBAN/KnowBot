import spacy
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS
from flask import jsonify, Blueprint, request
from API import groq_api_key
from groq import Groq
import json
import traceback

# Initialize Blueprint and CORS
youtube_bp = Blueprint('youtube', __name__)
CORS(youtube_bp, resources={r"/uploadLink": {"origins": "http://localhost:5173"}})

# Initialize Groq client
client = Groq(api_key=groq_api_key)
nlp = spacy.load("en_core_web_sm")

# Route to handle YouTube video link and summarize transcript
@youtube_bp.route('/uploadLink', methods=['POST'])
def youtube_summary():
    
    try:
        data = request.json
        link = data.get('link')

        # Extract video ID from the link
        video_id = link.split('v=')[-1].split('&')[0]

        # Fetch transcript from YouTube
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([t['text'] for t in transcript])

        # Process transcript text with spaCy
        doc = nlp(transcript_text)
        sentences = [sent.text for sent in doc.sents]
        print("Request received")
        # Function to get summary from Groq for a given text chunk
        def get_summary_from_groq(text_chunk):
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": f"Give the summary for the passage: {text_chunk}.",
                    }
                ],
                model="llama3-8b-8192",
            )
            return chat_completion.choices[0].message.content

        # Chunk the sentences for summarization based on character count
        chunk_size = 500  # Character count limit for each chunk
        chunks = []
        current_chunk = ""

        for sentence in sentences:
            if len(current_chunk) + len(sentence) <= chunk_size:
                current_chunk += sentence + " "
            else:
                chunks.append(current_chunk.strip())
                current_chunk = sentence + " "

        if current_chunk:
            chunks.append(current_chunk.strip())

        # Summarize each chunk and accumulate the final summary
        final_summary = ""
        for chunk in chunks:
            summary = get_summary_from_groq(chunk)
            final_summary += summary + " "

        # Return the final cumulative summary
        ans = {"answer": final_summary.strip()}
        return jsonify(ans)

    except Exception as e:
        # Log the full error traceback for debugging
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500
