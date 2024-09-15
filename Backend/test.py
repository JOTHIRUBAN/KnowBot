import yt_dlp

# YouTube video URL
video_url = "https://www.youtube.com/watch?v=dxPWXg3avNs"

# Define the options for downloading only the audio
ydl_opts = {
    'format': 'bestaudio/best',  # Select the best audio format available
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',  # Use FFmpeg to extract audio
        'preferredcodec': 'mp3',      # Convert to mp3 format
        'preferredquality': '192',    # Audio quality (192 kbps)
    }],
    'ffmpeg_location': 'C:/path/to/ffmpeg',  # Path to ffmpeg folder (Optional)
    'outtmpl': 'audio_file.%(ext)s',  # Output file template
}

# Download the audio
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    ydl.download([video_url])

print("Audio downloaded as 'audio_file.mp3'")
