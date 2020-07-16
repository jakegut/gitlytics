from marshmallow import Schema, fields, validate

import views.courses.schemas as course_schema

class InviteSchema(Schema):
    id = fields.Int()
    username = fields.Str()
    course = fields.Nested(course_schema.CourseSchema)

class CreateInviteSchema(Schema):
    username = fields.Str(required=True)
    course_id = fields.Int(required=True)

invite_schema = InviteSchema()
invites_schema = InviteSchema(many=True)