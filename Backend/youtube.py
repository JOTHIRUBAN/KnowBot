import spacy
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_groq import ChatGroq
from flask_cors import CORS
from flask import jsonify,Blueprint,request
from API import groq_api_key
from groq import Groq
import json


youtube_bp = Blueprint('youtube',__name__)
CORS(youtube_bp, resources={r"/uploadLink": {"origins": "http://localhost:5173"}})

# Initialize Groq client
client = Groq(api_key= groq_api_key)
nlp = spacy.load("en_core_web_sm")

@youtube_bp.route('/uploadLink', methods=['POST'])
def youtube_summary():
    data = request.json
    link = data.get('link')

# Fetch transcript
    video_link = link
    video_id = video_link.split('v=')[-1]
    video_id = video_id.split('&')[0]

    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    transcript_text = " ".join([t['text'] for t in transcript])

    # Process text with spaCy
    doc = nlp(transcript_text)
    sentences = [sent.text for sent in doc.sents]

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

    # Split transcript into chunks (you can adjust the chunk size based on limits)
    chunk_size = 500  # Adjust as needed to fit within API limits
    chunks = [(sentences[i:i+chunk_size]) for i in range(0, len(sentences), chunk_size)]

    # Initialize final summary
    final_summary = ""

    # Loop through chunks, get summaries, and accumulate them
    for chunk in chunks:
        summary = get_summary_from_groq(chunk)
        final_summary+= summary

    # Print the final cumulative summary
    ans = {"answer": final_summary}
    return ans
