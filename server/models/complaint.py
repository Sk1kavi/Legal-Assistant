from db import complaints_collection
from bson.objectid import ObjectId
from datetime import datetime

def file_complaint(data):
    complaint = {
        "user_id": ObjectId(data["user_id"]),
        "details": data["details"],
        "against_name": data["against_name"],
        "for_someone_else": data["for_someone_else"],
        "status": "pending",
        "lawyer_id": None,
        "created_at": datetime.utcnow()
    }

    if data["for_someone_else"]:
        extra = ["person_name", "person_mobile", "person_address", "person_state", "person_district"]
        for field in extra:
            complaint[field] = data.get(field)

    complaints_collection.insert_one(complaint)
    return {"message": "Complaint filed successfully"}

def get_complaints_by_user(user_id):
    complaints = complaints_collection.find({"user_id": ObjectId(user_id)})
    result = []
    for complaint in complaints:
        complaint["_id"] = str(complaint["_id"])
        complaint["user_id"] = str(complaint["user_id"])
        if complaint.get("lawyer_id"):
            complaint["lawyer_id"] = str(complaint["lawyer_id"])
        result.append(complaint)
    return result

def get_all_complaints_for_lawyers(status=None):
    query = {}
    if status:
        query["status"] = status
    complaints = complaints_collection.find(query)
    result = []
    for complaint in complaints:
        complaint["_id"] = str(complaint["_id"])
        complaint["user_id"] = str(complaint["user_id"])
        if complaint.get("lawyer_id"):
            complaint["lawyer_id"] = str(complaint["lawyer_id"])
        result.append(complaint)
    return result

def accept_complaint_by_lawyer(complaint_id, lawyer_id):
    complaints_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": {"status": "accepted", "lawyer_id": ObjectId(lawyer_id)}}
    )
    return {"message": "Complaint accepted"}

def update_complaint_status(complaint_id, status):
    if status not in ["pending", "accepted", "solved"]:
        return {"error": "Invalid status"}
    complaints_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": {"status": status}}
    )
    return {"message": "Status updated"}
