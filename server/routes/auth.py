from flask import Blueprint, request, jsonify
from models.user import register_user, login_user
import jwt
import os
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    return jsonify(register_user(data))

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = login_user(data)
    if user:
        payload = {
            "id": str(user["_id"]),
            "role": user["role"],
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        token = jwt.encode(payload, os.environ["SECRET_KEY"], algorithm="HS256")
        return jsonify({"token": token})
    return jsonify({"error": "Invalid credentials"}), 401
