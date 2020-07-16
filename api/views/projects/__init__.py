from flask import Blueprint, render_template, url_for, redirect, request, jsonify, g
from flask_jwt_extended import jwt_required, current_user
from requests_oauthlib import OAuth2Session
from marshmallow import ValidationError

from app import db
from models import Course, Invite
import views.projects.schemas as ps

projects = Blueprint('projects', __name__)

@projects.route("/", methods=['POST'])
@jwt_required
def create_project():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No json provided"}), 400
    try:
        data = ps.project_create_schema.load(json_data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 422
    course = Course.query.get(data['course_id'])
    if not course:
        return jsonify(error="Course ID not found"), 400
    if course.owner_id != current_user.id:
        return jsonify(error="Unauthorized to add a project to course"), 403

