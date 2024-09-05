from flask import Blueprint, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain_community.chat_message_histories.upstash_redis import UpstashRedisChatMessageHistory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
youtube_bp = Blueprint('youtube', __name__)
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

URL = "https://secure-mollusk-56467.upstash.io"
TOKEN = "AdyTAAIjcDEyOTVjMDRlYjRiODM0YTczYWQ1MzVkOTU5MjlhMzM4NXAxMA"
history = UpstashRedisChatMessageHistory(
    url=URL, token=TOKEN, ttl=500, session_id="chat1"
)

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


def extract_transcript_details(youtube_video_url):
    try:
        video_id = youtube_video_url.split("=")[1]
        transcript_text = YouTubeTranscriptApi.get_transcript(video_id)
        
        transcript = ""
        for i in transcript_text:
            transcript += " " + i["text"]

        return transcript

    except Exception as e:
        raise e

def get_response(input_text):
    # Use the global transcript_text to generate a response
    global transcript_text
    inp = f"{input_text}"
    q = {"input": inp}
    response = chain.invoke(q)
    return response["text"]

@youtube_bp.route('/load-link', methods=['POST'])
def youtube_summary():
    global transcript_text
    data = request.json
    youtube_link = data.get('youtube_link')
    if youtube_link:
        try:
            transcript_text =  extract_transcript_details(youtube_link)
            ans = get_response(f" Summarise the transcript: {transcript_text}")
            return jsonify({"status": ans})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "YouTube link not provided"}), 400

@youtube_bp.route('/y-chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('question', '')
    
    if not user_input:
        return jsonify({"error": "No question provided"}), 400

    answer = get_response(user_input)
    return jsonify({"answer": answer})
