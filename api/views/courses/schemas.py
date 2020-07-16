from marshmallow import Schema, fields, validate
import views.users.schemas as user_schemas

class CreateCourseSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=5))
    invited_users = fields.List(fields.Str(), required=True)

class CourseSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    invite_id = fields.Str()
    owner = fields.Nested(user_schemas.UserSchema)
    users = fields.Nested(user_schemas.UserSchema(many=True))

create_course_schema = CreateCourseSchema()
course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)