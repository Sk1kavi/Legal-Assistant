from flask import Blueprint, request, jsonify
from models.user import register_user, login_user
import jwt
from flask_jwt_extended import create_access_token, get_jwt
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
        access_token = create_access_token(
            identity=str(user["_id"]),
            additional_claims={"role": user["role"]}
        )
        return jsonify(access_token=access_token)
    return jsonify({"error": "Invalid credentials"}), 401