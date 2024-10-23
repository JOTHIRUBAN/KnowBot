from flask import Flask, request, jsonify , session
from flask_cors import CORS
from auth import auth_bp
from bot import get_response  
from youtube import youtube_bp  # Import the youtube blueprint
from pdfhandle import pdf_bp  # Import the pdf blueprint
from chatpdf import chatpdf_bp
from chatimg import chatimg_bp
from feed import feed_bp
from db_connection import get_db_connection 
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import markdown
from groq import Groq
client = Groq(
    api_key="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",
)

app = Flask(__name__)
CORS(app,supports_credentials=True)
app.config['MAX_CONTENT_LENGTH'] = 45 * 1024 * 1024  # Limit to 45 MB
app.secret_key = 'your_secret_key'
# Register the authentication blueprint
app.register_blueprint(auth_bp, url_prefix='/api/')

# Register the youtube blueprint
app.register_blueprint(youtube_bp, url_prefix='/api/')

# Register the PDF blueprint
app.register_blueprint(pdf_bp, url_prefix='/api/')

#Register the chat-pdf blueprint
app.register_blueprint(chatpdf_bp, url_prefix='/api/')

app.register_blueprint(chatimg_bp, url_prefix='/api/')

#Register the feed blueprint
app.register_blueprint(feed_bp,url_prefix='/')
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('question', '')
    
    if not user_input:
        return jsonify({"error": "No question provided"}), 400

    answer = get_response(user_input)
    return jsonify({"answer": answer})

def fetch_id(username):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM users WHERE name='{username}'")
    rows = cur.fetchone()
    cur.close()
    conn.close()
    return rows[0]

def fetch_content():
    username = session['name']  # Replace with session["gmail"] if using session
    userid = fetch_id(username)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT topic_name, string_agg(keyword, ',') as keywords FROM topic_log WHERE user_id = '{userid}' AND feed_date >= date_trunc('week', current_date) AND feed_date < date_trunc('week', current_date) + interval '1 week' GROUP BY topic_name;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def send_email(to, subject, body):
    try:
        # Zoho Mail SMTP configuration
        smtp_server = 'smtp.zoho.in'
        smtp_port = 465  # Use 465 for SSL
        smtp_username = 'knowbot@zohomail.in' # Your Zoho email address
        smtp_password = 'mVp7XmPYYWHw'  # Your Zoho email password

        # Create a multipart message
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = to  # Assuming 'to' is a list of recipients
        msg['Subject'] = subject

        # Attach the email body to the message
        msg.attach(MIMEText(body, 'html'))
        print("Message attached")
        print("\n Message:",body)
        
        # Connect to the server and send the email using SSL
        server = smtplib.SMTP_SSL(smtp_server, smtp_port)  # Use SMTP_SSL for SSL connection
        server.login(smtp_username, smtp_password)
        server.send_message(msg)
        server.quit()
        print("Email sent successfully!")
        
    except Exception as e:
        print("Failed to send email:", str(e))


def gensum():
    """content = fetch_content()
    summary_content = {}

    prompt_format = "Give the output as a json object as {title: 'title' , summary: 'summary}"
   
    for title, keywords in content:
        messages = [("system",prompt_format),("human",f"Give the summary of 500 words using {keywords}")]
        response = genresponse(messages).json
        summary_content[title] = response["summary"]
    """

    content = fetch_content()
    summary_content={}
    for title,keywords in content:
        chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": f"Give the summary of 150 words using {keywords} ",
                    }
                ],
                model="llama3-8b-8192",
            )
        summary_content[title] = chat_completion.choices[0].message.content
    
    # Convert summary_content to a string format suitable for the email body

    email_body = "\n\n".join([markdown.markdown(f"###{title}: {summary}") for title, summary in summary_content.items()])
    print("Summary generated")

    send_email(
        to=session['email'],
        subject="Weekly Summary",
        body=email_body
    )

    """
if not scheduler.get_job('gensum_job'):
    scheduler.add_job(gensum, 'interval', seconds=80, id='gensum_job', max_instances=1)

if not scheduler.get_job('gentopic_job'):
    scheduler.add_job(gentopic, 'interval', seconds=80, id='gentopic_job', max_instances=1)
"""

if __name__ == '__main__':
    #gensum()
    app.run(debug=True)
