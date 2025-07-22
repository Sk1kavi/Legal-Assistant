import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.environ['MONGO_URI'])
db = client['legal_chatbot']
users_collection = db['users']
complaints_collection = db['complaints']
