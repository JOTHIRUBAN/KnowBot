from flask import  Blueprint, jsonify, request, session
from API import groq_api_key 
from db_connection import get_db_connection  
import json
from langchain_groq import ChatGroq

feed_bp = Blueprint('feed',__name__)
def fetch_id(username):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT user_id FROM users WHERE name='{username}'")
    rows = cur.fetchone()
    cur.close()
    conn.close()
    return rows[0]

def fetch_content():
    username = "vijay"  # Replace with session["gmail"] if using session
    userid = fetch_id(username)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT topic_name, string_agg(keyword, ',') as keywords FROM topic_log WHERE user_id = '{userid}' AND feed_date >= date_trunc('week', current_date) AND feed_date < date_trunc('week', current_date) + interval '1 week' GROUP BY topic_name;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


def genresponse(prompt):
        llm = ChatGroq(model="llama3-70b-8192",
                    api_key=groq_api_key,
                    model_kwargs={"response_format": {"type": "json_object"}},
                    temperature=0.1,
                    max_tokens=4096,
                    timeout=10,
                    max_retries=10)
        content = json.loads(llm.invoke(prompt).content)
        return jsonify(content)

def fetch_topic(id=1, topic=""):
    userid = id
    conn = get_db_connection()
    cur = conn.cursor()
    if topic == "":
        cur.execute("SELECT user_id, topic, current_level FROM topic WHERE user_id = %s;", (userid,))
    else:
        cur.execute("SELECT user_id, topic, current_level FROM topic WHERE user_id = %s AND topic = %s;", (userid, topic))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def update_topic(level):
    conn = get_db_connection()
    cur = conn.cursor()
    id = fetch_id("vijay")
    query = "UPDATE topic SET current_level = %s WHERE id = %s"
    cur.execute(query, (level, id))
    conn.commit()
    cur.close()
    conn.close()

    

def generate_desc(user_data):
    system_message = "Provide the output as a JSON object with an array of objects, each containing 'topic' and 'description' fields."
    prompt = (
        f"You are an educational specialist. A user is currently studying the course '{user_data[1]}'. "
        f"Please provide a detailed description of the topic '{user_data[2]}' within the course '{user_data[1]}'. "
        f"The description should be around 250 words and should cover the key concepts, importance, and any relevant examples or applications. "
        f"The output should be a JSON object with an array of objects, each containing 'topic' and 'description' fields."
    )
    messages = [("system", system_message), ("user", prompt)]
    return messages

def generate_topic(user_data):
    system = "Give the output as a json object as { topic : 'any topic' }"
    prompt = f"A user is currently studying about the course {user_data[1]}\n He studied upto {user_data[2]}\n suggest him about the next topic to learn as the required result \n"
    mes = [('system' , system), ('user' , prompt)]
    return mes

def gentopic():
    data = fetch_topic()[0]
    prompt = generate_topic(data)
    response = genresponse(prompt).get_json()
    topic = response['topic']
    update_topic(topic)

@feed_bp.route('/feed', methods=['GET'])
def feed():
    if 'id' not in session:
        return jsonify({"status": "failure", "message": "User not logged in"}), 401

    id = session['id']
    data = fetch_topic(id)
    
    if not data:
        return jsonify({"status": "success", "message": "No topics found"}), 200

    system = """Json {"topics": [{"topic": "topic1", "description": "a catchy description of topic1"}, {"topic": "topic2", "description": "a catchy description of topic2"}, ...]}"""
    prompt = "For each of the following topics, provide a catchy description in 10 to 15 words. The output should be a JSON object with an array of objects, each containing 'topic' and 'description' fields. Topics: "
    for _, topic, _ in data:
        prompt += f"{topic}, "
    prompt = prompt.rstrip(', ')

    messages = [("system", system), ("user", prompt)]
    res = genresponse(messages).get_json()
    return res

@feed_bp.route('/feed', methods=['POST'])
def add_topic():
    if 'id' not in session or 'email' not in session:
        return jsonify({"status": "failure", "message": "User not logged in"}), 401

    data = request.json
    topic = data.get('topic')
    level = data.get('level')

    if not topic or not level:
        return jsonify({"status": "failure", "message": "Topic and level are required"}), 400

    user_id = session['id']
    user_email = session['email']

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO topic (user_id, topic, current_level) VALUES (%s, %s, %s)", (user_id, topic, level))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "success", "message": "Topic added successfully"}), 201

@feed_bp.route('/topic/<level>', methods=['GET'])
def genfeed(level):
    data = fetch_topic(session['id'], level)[0]
    prompt = generate_desc(data)
    response = genresponse(prompt)    
    return response

@feed_bp.route('/topic/<title>/quiz', methods=['GET'])
def quizpage(title):
    keyword = fetch_topic(session['id'], title)[0][2]
    print(keyword)
    prompt_format = """
    Please generate a set of 10 multiple-choice questions (MCQs) for each of the following topics.
    The output must be a json object:
    {
       "topic":{ "questions": [
            {
                "question": "<question_text>",
                "options": ["<option1>", "<option2>", "<option3>", "<option4>"],
                "answer": "<correct_option>"
            }
        ]
    }
    }
    """
    
    messages = [
        ("system", prompt_format),
        ("human", f"Give the 10 MCQ questions for each topic in {keyword} of {title}.")
    ]
  
    return genresponse(messages)


