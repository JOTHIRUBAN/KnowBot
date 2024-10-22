
import pytube
from pytube.exceptions import RegexMatchError

url1 = 'https://www.youtube.com/watch?v=9bZkp7q19f0'

try:
    url = pytube.YouTube(url1)
    audio = url.streams.get_audio_only()
    audio.download()
except RegexMatchError as e:
    print(f"An error occurred: {e}")
    print("This is likely due to a change in YouTube's JavaScript. Please update pytube or check for a patch.")
    