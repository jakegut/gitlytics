from marshmallow import Schema, fields, validate
from models import ProjectTypes

class ProjectCreateSchema(Schema):
    name = fields.Str(required=True)
    description = fields.Str(required=True)
    course_id = fields.Int(required=True)
    type = fields.Str(required=True, validate=validate.OneOf([e.values for e in ProjectTypes]))

class ProjectSchema(Schema):
    id = fields.Int()
    name = fields.Int()
    description = fields.Str()
    type = fields.Str()

project_create_schema = ProjectCreateSchema()
project_schema = ProjectSchema()
