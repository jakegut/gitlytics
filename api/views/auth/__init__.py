from flask import Blueprint, url_for, redirect, session, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_raw_jwt
from requests_oauthlib import OAuth2Session
from models import User, TokenList
from urllib.parse import urlencode
from sqlalchemy.orm.exc import NoResultFound
from app import db
from utils import generate_token
import settings
from marshmallow import Schema, fields

import requests as req

auth = Blueprint('auth', __name__)

client_id = settings.GITHUB_OAUTH_CLIENT_ID,
client_secret = settings.GITHUB_OAUTH_CLIENT_SECRET

class AuthUserSchema(Schema):
    username = fields.Str()
    avatar_url = fields.Str()
    owned_courses = fields.Method("get_owned_courses_array")

    def get_owned_courses_array(self, obj):
        return [c.id for c in obj.owned_courses]

user_schema = AuthUserSchema()

@auth.route("/login")
def index():
    """Step 1: User Authorization.
        Redirect the user/resource owner to the OAuth provider (i.e. Github)
        using an URL with a few key OAuth parameters.
        """
    params = {
        "client_id": settings.GITHUB_OAUTH_CLIENT_ID,
        "redirect_uri": settings.CLIENT_REDIRECT_URI,
        "state": generate_token(),
        "scope": ' '.join(('repo', 'user'))
    }


    authorization_url = f"{settings.GITHUB_AUTHORIZATION_URL}?{urlencode(params)}"

    # State is used to prevent CSRF, keep this for later.
    print(params['state'])
    session['oauth_state'] = params['state']
    return jsonify({'url': authorization_url})

@auth.route("/token", methods=['POST'])
def callback():
    """ Step 3: Retrieving an access token.
        The user has been redirected back from the provider to your registered
        callback URL. With this redirection comes an authorization code included
        in the redirect URL. We will use that to obtain an access token.
        """
    params = {
        "client_id": client_id,
        "client_secret": client_secret,
        "code": request.json['code'],
        "state": session['oauth_state']
    }



    # github = OAuth2Session(client_id, state=session['oauth_state'])
    # token = github.fetch_token(token_url, client_secret=client_secret,
    #                            authorization_response=request.url)

    token_request = req.post(settings.GITHUB_TOKEN_URL, json=params, headers={"Accept": "application/json"})
    github_token = token_request.json()
    github = OAuth2Session(client_id, token=github_token)
    github_user = github.get(f"{settings.GITHUB_API_BASE_URL}user").json()

    query = User.query.filter_by(username=github_user['login'])
    try:
        user = query.one()
    except NoResultFound:
        user = User(username=github_user['login'],
                    email=github_user['email'],
                    name=github_user['name'],
                    avatar_url=github_user['avatar_url'])
        db.session.add(user)
        db.session.commit()

    user.oauth_token = github_token['access_token']
    db.session.commit()

    access_token = create_access_token(user)

    TokenList.add_to_db(access_token, current_app.config['JWT_IDENTITY_CLAIM'])

    ret = {
        "access_token": access_token,
        "user": user_schema.dump(user)
    }
    return jsonify(ret)

@auth.route("/user")
@jwt_required
def get_user():
    user = User.query.filter_by(username=get_jwt_identity()).first()
    if user is None:
        return jsonify({"error": "error"})
    return jsonify({"user": user_schema.dump(user)})

@auth.route('/logout', methods=['DELETE'])
@jwt_required
def logout_user():
    TokenList.revoke(get_raw_jwt())
    return jsonify(msg="Successfully logged out"), 200