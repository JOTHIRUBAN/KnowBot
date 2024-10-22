from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
#from langchain_redis import RedisChatMessageHistory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_community.chat_message_histories import RedisChatMessageHistory
import redis

# Initialize Redis connection (for local Redis)
redis_urll = "redis://localhost:6380"  # Use this URL for local Redis

history = RedisChatMessageHistory(
    url=redis_urll, ttl=500, session_id="chat2"
)

# Initialize model, prompt, memory, and chain
model = ChatGroq(
    temperature=1.0,
    groq_api_key="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",
    model="mixtral-8x7b-32768",
)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a friendly AI assistant."),
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
    inp = input_text
    q = {"input": inp}
    response = chain.invoke(q)
    return response["text"]
