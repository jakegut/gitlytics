from marshmallow import Schema, fields, validate
from models import ProjectTypes
from views.users.schemas import UserSchema

class GroupSchema(Schema):
    id = fields.Int()
    project_id = fields.Int()
    users = fields.List(fields.Nested(UserSchema))

class RepoSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    project_id = fields.Int()
    user_id = fields.Int()
    group = fields.Nested(GroupSchema)

class GitdataSchema(Schema):
    sha = fields.Str()
    additions = fields.Int()
    deletions = fields.Int()
    date = fields.DateTime()
    contributor_user = fields.Str()

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
    user_repo = fields.Method("get_user_repo")
    user_group = fields.Method("get_user_group")

    def get_user_repo(self, obj):
        if 'current_user' in self.context:
            return RepoSchema().dump(obj.get_repo_for_user(self.context['current_user'].id))
        return "No user context"

    def get_user_group(self, obj):
        if 'current_user' in self.context:
            return  GroupSchema().dump(obj.get_group_for_user(self.context['current_user'].id))
        return "No user context"

project_create_schema = ProjectCreateSchema()
project_schema = ProjectSchema()
repo_schema = RepoSchema()
