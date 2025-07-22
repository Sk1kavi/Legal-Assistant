from db import users_collection
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

def register_user(data):
    if users_collection.find_one({"email": data["email"]}):
        return {"error": "Email already exists"}

    hashed_pw = generate_password_hash(data["password"])
    user = {
        "name": data["name"],
        "email": data["email"],
        "password": hashed_pw,
        "role": data["role"],  # user / lawyer
        "address": data["address"],
        "district": data["district"],
        "state": data["state"],
        "mobile": data["mobile"]
    }
    users_collection.insert_one(user)
    return {"message": "Registered successfully"}

def login_user(data):
    user = users_collection.find_one({"email": data["email"]})
    if user and check_password_hash(user["password"], data["password"]):
        return user
    return None
