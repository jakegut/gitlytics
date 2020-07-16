from flask import Blueprint, render_template, url_for, redirect, request, jsonify, g
from flask_jwt_extended import jwt_required, current_user
from requests_oauthlib import OAuth2Session
from marshmallow import ValidationError

from app import db
import views.invites.schemas as invite_schemas
from models import Course, Invite, User
import settings

user = Blueprint('user', __name__)

@user.route("/invites")
@jwt_required
def get_user_invites():
    invs = Invite.query.filter_by(username=current_user.username).all()
    ret = {
        "invites": invite_schemas.invites_schema.dump(invs)
    }
    return jsonify(ret), 200