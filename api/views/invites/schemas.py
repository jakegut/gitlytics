from marshmallow import Schema, fields, validate

import views.courses.schemas as cs

class InviteSchema(Schema):
    id = fields.Int()
    username = fields.Str()
    course = fields.Nested(cs.CourseSchema())

class CreateInviteSchema(Schema):
    username = fields.Str(required=True)
    course_id = fields.Int(required=True)

invite_schema = InviteSchema()
invites_schema = InviteSchema(many=True)