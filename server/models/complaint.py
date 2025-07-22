from db import complaints_collection
from bson.objectid import ObjectId
from datetime import datetime

def file_complaint(user_id, details, on_behalf_of=None):
    complaint = {
        "user_id": ObjectId(user_id),
        "on_behalf_of": on_behalf_of,  # or None
        "details": details,
        "status": "pending",
        "lawyer_id": None,
        "created_at": datetime.utcnow()
    }
    complaints_collection.insert_one(complaint)
    return {"message": "Complaint filed"}

def get_complaints_by_user(user_id):
    return list(complaints_collection.find({"user_id": ObjectId(user_id)}))

def get_all_complaints_for_lawyers():
    return list(complaints_collection.find({}))

def update_complaint_status(complaint_id, status, lawyer_id=None):
    update = {"status": status}
    if lawyer_id:
        update["lawyer_id"] = ObjectId(lawyer_id)
    complaints_collection.update_one({"_id": ObjectId(complaint_id)}, {"$set": update})
    return {"message": "Status updated"}
