from flask_cors import CORS
from flask import Blueprint,request
from API import groq_api_key
from groq import Groq
import yt_dlp
from moviepy.editor import AudioFileClip
import assemblyai as aai

youtube_bp = Blueprint('youtube',__name__)
CORS(youtube_bp, resources={r"/uploadLink": {"origins": "http://localhost:5173"}})

# Initialize Groq client
client = Groq(api_key= groq_api_key)
aai.settings.api_key = "dbdf01eab50a47c0bdb4cf8b54a51817"

@youtube_bp.route('/uploadLink', methods=['POST'])
def youtube_summary():
    data = request.json
    url = data.get('link')

    # Fetch transcript
    def get_summary_from_groq(text_chunk):
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
    ans = {"answer": final_summary}
    return ans



