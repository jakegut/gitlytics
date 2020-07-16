from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Int()
    username = fields.Str()
    email = fields.Str()
    name = fields.Str()

user_schema = UserSchema()
users_schema = UserSchema(many=True)