from flask import Blueprint, request, jsonify, session
from db_connection import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"status": "failure", "message": "Email and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name, email, password, id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if user and user[2] == password:
        session['name'] = user[0]
        session['email'] = user[1]
        session['id'] = user[3]
        return jsonify({"status": "success", "message": "Login successful", "name": user[0]}), 200
    else:
        return jsonify({"status": "failure", "message": "Invalid email or password"}), 401

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"status": "failure", "message": "Email already exists"}), 400

    cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, password))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Account created successfully"}), 201