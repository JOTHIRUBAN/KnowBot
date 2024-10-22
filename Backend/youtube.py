from flask_cors import CORS
from flask import Blueprint,request,jsonify
from API import groq_api_key
from groq import Groq
import json
import yt_dlp
from moviepy.editor import AudioFileClip
import assemblyai as aai
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder

youtube_bp = Blueprint('youtube',__name__)
CORS(youtube_bp, resources={r"/uploadLink": {"origins": "http://localhost:5173"}})

# Initialize Groq client
client = Groq(api_key= "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")
aai.settings.api_key = "dbdf01eab50a47c0bdb4cf8b54a51817"

# Initialize Redis connection (for local Redis)
redis_urll = "redis://localhost:6380"  # Use this URL for local Redis

history = RedisChatMessageHistory(
    url=redis_urll, ttl=500, session_id="chat2"
)

model = ChatGroq(
    temperature=1.0,
    groq_api_key="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",
    model="llama3-70b-8192",
    max_tokens=None
)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a friendly AI assistant who excels in providing assistance from the given transcript of a YouTube video."),
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

def get_response(input_text):
    global final_summary
    inp = f"{input_text}"
    q = {"input": inp}
    response = chain.invoke(q)
    return response["text"]

@youtube_bp.route('/uploadLink', methods=['POST'])
def youtube_summary():
    data = request.json
    url = data.get('link')
    global final_summary

    # Fetch transcript
    def get_summary_from_groq(text_chunk):
        print("Getting summary for text chunk...")
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"Give the short summary for the passage: {text_chunk}.",
                }
            ],
            model="llama3-8b-8192",
        )
        return chat_completion.choices[0].message.content

    def get_transcript(file_path):
        transcriber = aai.Transcriber()
        print("Transcribing audio file...")
        transcript = transcriber.transcribe(file_path)
        if transcript.status == aai.TranscriptStatus.error:
            print(transcript.error)
        print("Transcription complete.")
        return transcript.text

    # Step 1: Download the audio using yt-dlp Python API in webm format
    def download_youtube_audio(url):
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': 'audio.%(ext)s',  # Save audio with correct extension (.webm in this case)
        # No post-processing needed, download the webm file directly
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            audio_file = ydl.prepare_filename(info_dict)  # audio.webm
        return audio_file
            
    def convert_webm_to_wav(webm_file):
        wav_file = "audio.wav"
        audio_clip = AudioFileClip(webm_file)  # Load the .webm file
        audio_clip.write_audiofile(wav_file)  # Convert to .wav
        audio_clip.close()  # Close the audio clip
        return wav_file

    
    # Download the YouTube audio in .webm format
    audio_file = download_youtube_audio(url)
        
    ## Convert the .webm audio to WAV

    wav_file = convert_webm_to_wav("audio.webm")

    transcript = (get_transcript("audio.wav"))

    chunk_size = 500  # Adjust as needed to fit within API limits
    chunks = [(transcript[i:i+chunk_size]) for i in range(0, len(transcript), chunk_size)]

    ## Initialize final summary
    final_summary = ""

    ## Loop through chunks, get summaries, and accumulate them
    for chunk in chunks:
        summary = get_summary_from_groq(chunk)
        final_summary+= summary


    ## Print the final cumulative summary
    # Replace newline characters with HTML <br> for proper display
    final_summary = final_summary.replace("\n", "<br>")

    # Return the summary wrapped in a JSON object
    ans = {"answer": final_summary}
    return jsonify(ans)

@youtube_bp.route('/y-chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('question', '')
    print(user_input)
    
    if not user_input:
        return jsonify({"error": "No question provided"}), 400

    answer = get_response(user_input)
    return jsonify({"answer": answer})
