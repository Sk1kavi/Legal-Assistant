from flask import Blueprint, request, jsonify
from models.complaint import (
    file_complaint,
    get_complaints_by_user,
    get_all_complaints_for_lawyers,
    accept_complaint_by_lawyer,
    update_complaint_status
)

complaint_bp = Blueprint("complaint", __name__)

# 1. File a Complaint
@complaint_bp.route("/file", methods=["POST"])
def file_complaint_route():
    data = request.get_json()

    required_fields = ["user_id", "details", "against_name", "for_someone_else"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 422

    return jsonify(file_complaint(data))

# 2. Get Complaints of a Specific User
@complaint_bp.route("/user/<user_id>", methods=["GET"])
def user_complaints(user_id):
    return jsonify(get_complaints_by_user(user_id))

# 3. Get All Complaints (for Lawyers/Admins)
@complaint_bp.route("/all", methods=["GET"])
def get_all_complaints():
    status_filter = request.args.get("status")
    return jsonify(get_all_complaints_for_lawyers(status_filter))

# 4. Lawyer Accepts a Complaint
@complaint_bp.route("/accept/<complaint_id>", methods=["POST"])
def accept_complaint(complaint_id):
    data = request.get_json()
    if "lawyer_id" not in data:
        return jsonify({"error": "Missing lawyer_id"}), 422
    return jsonify(accept_complaint_by_lawyer(complaint_id, data["lawyer_id"]))

# 5. Change Complaint Status (Accepted → Solved)
@complaint_bp.route("/status/<complaint_id>", methods=["PUT"])
def change_status(complaint_id):
    data = request.get_json()
    if "status" not in data:
        return jsonify({"error": "Missing status"}), 422
    return jsonify(update_complaint_status(complaint_id, data["status"]))
