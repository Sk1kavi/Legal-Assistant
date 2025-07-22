from flask import Blueprint, request, jsonify
from models.complaint import file_complaint, get_complaints_by_user, get_all_complaints_for_lawyers, update_complaint_status
from flask_jwt_extended import jwt_required, get_jwt_identity

complaint_bp = Blueprint("complaint", __name__)

@complaint_bp.route("/file", methods=["POST"])
@jwt_required()
def file():
    user = get_jwt_identity()
    data = request.get_json()
    return jsonify(file_complaint(user_id=user["id"], details=data["details"], on_behalf_of=data.get("on_behalf_of")))

@complaint_bp.route("/complaints", methods=["GET"])
@jwt_required()
def user_complaints():
    user = get_jwt_identity()
    return jsonify(get_complaints_by_user(user["id"]))

@complaint_bp.route("/all", methods=["GET"])
@jwt_required()
def lawyer_view_all():
    user = get_jwt_identity()
    if user["role"] != "lawyer":
        return jsonify({"error": "Unauthorized"}), 403
    return jsonify(get_all_complaints_for_lawyers())

@complaint_bp.route("/<id>/status", methods=["PATCH"])
@jwt_required()
def update_status(id):
    user = get_jwt_identity()
    data = request.get_json()
    if user["role"] != "lawyer":
        return jsonify({"error": "Only lawyers can change status"}), 403
    return jsonify(update_complaint_status(id, data["status"], user["id"]))
