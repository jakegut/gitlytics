from flask import Blueprint, render_template, url_for, redirect, request, jsonify, g
from flask_login import current_user
from flask_jwt_extended import jwt_required, current_user
from requests_oauthlib import OAuth2Session
from marshmallow import ValidationError

from app import db
from . import schemas
import views.invites.schemas as inv_schemas
import views.projects.schemas as ps
import views.users.schemas as u_schemas
from models import Course, Invite, User
import settings

courses = Blueprint('courses', __name__)

def is_student_or_owner(course_id):
    course = Course.query.filter_by(id=course_id).first()
    if course is None:
        return jsonify(error="Course not found"), 404
    is_owner = (course.owner_id == current_user.id)
    is_user = course.is_user(current_user.id)
    if is_owner is False and is_user is False:
        return jsonify(error="Unauthorized to view course"), 403
    return course

@courses.route("/")
@jwt_required
def index():
    return jsonify({
        "owned_courses": schemas.CourseSchema(many=True, exclude=("users", "projects")).dump(current_user.owned_courses),
        "courses": schemas.CourseSchema(many=True, exclude=("users", "projects")).dump(current_user.courses)
    })

@courses.route("/", methods=['POST'])
@jwt_required
def create():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No json provided"}), 400
    try:
        data = schemas.create_course_schema.load(json_data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 422

    course = Course(name=data['name'], owner_id=current_user.id)
    db.session.add(course)
    db.session.commit()

    for user in data['invited_users']:
        db.session.add(Invite(username=user, course_id=course.id))

    db.session.commit()

    return jsonify(schemas.course_schema.dumps(course))

@courses.route("/<int:course_id>")
@jwt_required
def get_course(course_id):
    course = is_student_or_owner(course_id)
    if not isinstance(course, Course):
        return course
    is_owner = course.owner_id == current_user.id
    c_schema = schemas.CourseSchema(exclude=("projects.groups",))
    c_schema.context['current_user'] = current_user
    ret = {
        "course": c_schema.dump(course)
    }
    if is_owner:
        ret['invites'] = inv_schemas.invites_schema.dump(course.invites)
    return jsonify(ret), 200

@courses.route("/<int:course_id>", methods=['DELETE'])
@jwt_required
def delete_course(course_id):
    course = Course.query.filter_by(id=course_id).first()
    if course is None:
        return jsonify(message="Course ID not found"), 404
    if course.id != current_user.id:
        return jsonify(message="Unauthorized to delete course"), 404
    db.session.delete(course)
    db.session.commit()

    return jsonify({}), 204

@courses.route("/<int:course_id>/students")
@jwt_required
def get_course_students(course_id):
    course = is_student_or_owner(course_id)
    if not isinstance(course, Course):
        return course
    ret = {
        "students": [{"id": u.id, "username": u.username} for u in course.users]
    }
    return jsonify(ret)


@courses.route("/search/student")
@jwt_required
def search_users():
    user = request.args.get("user")

    github = OAuth2Session(settings.GITHUB_OAUTH_CLIENT_ID, token={"access_token":current_user.oauth_token})
    resp = github.get(f"{settings.GITHUB_API_BASE_URL}search/users?q={user}+in:login").json()

    return jsonify([{"login": u['login'], "avatar_url": u['avatar_url']} for u in resp['items'][0:5]])

@courses.route("/check", methods=['POST'])
@jwt_required
def check_users():
    students = request.get_json()['students']
    invalid_students = []
    valid_students = []
    github = OAuth2Session(settings.GITHUB_OAUTH_CLIENT_ID, token={"access_token": current_user.oauth_token})

    for student in students:
        resp = github.get(f"{settings.GITHUB_API_BASE_URL}users/{student}")
        if resp.status_code != 200:
            invalid_students.append(student)
        else:
            valid_students.append(student)

    return jsonify({"invalid_students": invalid_students, "valid_students": valid_students})