from boltiotai import openai
import os
from db import client
from routes.auth import auth_bp
from routes.complaint import complaint_bp
from flask import Flask, request , jsonify
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()
from flask_jwt_extended import JWTManager

openai.api_key = os.environ['OPENAI_API_KEY']

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = ["headers"]  # Default is headers
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

jwt = JWTManager(app)
CORS(app)  # Allow requests from your React frontend
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(complaint_bp, url_prefix='/complaint')

def generate_legal_answer(state, question):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages = [
    {
        "role": "system",
        "content": (
            "You are a multilingual Indian legal assistant. "
            "The user may ask legal questions in any Indian language (like Tamil, Hindi, Telugu, Malayalam, etc.). "
            "Your job is to understand the user's input, detect the language, and respond in the same language. "
            "Ensure your answer is clear, concise, and includes any state-specific legal information for the state provided. "
            "If you are unsure, mention that laws may vary or advise the user to consult a local lawyer."
        )
    },
    {
        "role": "user",
        "content": f"The user is from {state}. They asked: {question}"
    }
]

    )
    return response['choices'][0]['message']['content']

@app.route('/api/legal-query', methods=['POST'])
def legal_query():
    data = request.get_json()
    state = data.get('state')
    question = data.get('question')

    if not state or not question:
        return {"error": "State and question are required."}, 400

    answer = generate_legal_answer(state, question)
    return {"answer": answer}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
