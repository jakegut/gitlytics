from marshmallow import Schema, fields, validate
from models import ProjectTypes
from views.users.schemas import UserSchema

class GroupSchema(Schema):
    id = fields.Int()
    project_id = fields.Int()
    users = fields.List(fields.Nested(UserSchema))

class ProjectCreateSchema(Schema):
    name = fields.Str(required=True)
    description = fields.Str(missing=None)
    course_id = fields.Int(required=True)
    start_date = fields.AwareDateTime(required=True)
    due_date = fields.AwareDateTime(required=True)
    type = fields.Str(required=True, validate=validate.OneOf([e.value for e in ProjectTypes]))
    groups = fields.List(fields.List(fields.Raw))

class ProjectSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    description = fields.Str()
    type = fields.Str()
    start_date = fields.DateTime()
    due_date = fields.DateTime()
    course_id = fields.Int()
    groups = fields.List(fields.Nested(GroupSchema))

project_create_schema = ProjectCreateSchema()
project_schema = ProjectSchema()
