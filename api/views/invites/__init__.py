from flask import Blueprint, render_template, url_for, redirect, request, jsonify, g
from flask_jwt_extended import jwt_required, current_user
from requests_oauthlib import OAuth2Session
from marshmallow import ValidationError

from app import db
from models import Course, Invite
import views.courses.schemas as course_schemas
import views.invites.schemas as views_schemas

invites = Blueprint('invites', __name__)

@invites.route("/accept/<invite_id>")
@jwt_required
def accept_invitation(invite_id):
    course = Course.query.filter_by(invite_id=invite_id).first()
    if not course:
        return jsonify(error="Course with invite id not found"), 400
    inv = Invite.query.filter_by(username=current_user.username, course_id=course.id).first()
    if not inv:
        return jsonify(error="Invite not found for user"), 400
    course.users.append(current_user)
    db.session.remove(inv)
    db.session.commit()
    return jsonify({
        "message": "success",
        "course": course_schemas.course_schema.dump(course)
    })

@invites.route("/a/<int:invite_id>")
@jwt_required
def accept_by_id(invite_id):
    inv = Invite.query.filter_by(username=current_user.username, id=invite_id).first()
    if not inv:
        return jsonify(error="Invite not found for user"), 400
    inv.course.users.append(current_user)
    db.session.delete(inv)
    db.session.commit()
    return jsonify({
        "message": "success",
        "course": course_schemas.course_schema.dump(inv.course)
    })

@invites.route("/create", methods=['POST'])
@jwt_required
def create_invites():
    json_data = request.get_json()
    course = Course.query.filter_by(id=json_data['course_id'], owner_id=current_user.id).first()
    if course is None:
        return jsonify(error="Course not found"), 400
    users = set([c.username for c in course.users])
    invs = set([i.username for i in course.invites])
    usernames = set(json_data['usernames']) - users - invs
    many_invs = [Invite(username=u, course_id=course.id) for u in usernames]
    [db.session.add(inv) for inv in many_invs]
    db.session.commit()
    return jsonify({
        "message": "success",
        "invites": views_schemas.invite_schema.dump(many_invs)
    })
