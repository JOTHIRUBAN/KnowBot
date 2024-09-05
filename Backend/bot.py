

from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain_community.chat_message_histories.upstash_redis import UpstashRedisChatMessageHistory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder

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

def get_response(input_text):
    inp = input_text + "Give the response in markdown format"
    q = {"input": inp}
    response = chain.invoke(q)
    return response["text"]
