from app import db
from models.User import User
from flask_restful import reqparse, abort, Resource, fields, marshal_with
from sqlalchemy.exc import IntegrityError
from bcrypt import hashpw, gensalt
from flask_jwt_extended import jwt_required, get_jwt_identity
from email.utils import parseaddr


user_fields = {
    'id': fields.Integer,
    'firstName': fields.String(attribute='first_name'),
    'lastName': fields.String(attribute='last_name'),
    'position': fields.String,
    'about': fields.String,
    'topics': fields.List(fields.String),
}

parserPost = reqparse.RequestParser()
parserPost.add_argument('email', required=True, location='json')
parserPost.add_argument('password', required=True, location='json')

parserPatch = reqparse.RequestParser()
parserPatch.add_argument('firstName', required=True)
parserPatch.add_argument('lastName', required=True)
parserPatch.add_argument('position', required=True)
parserPatch.add_argument('about', required=True)
parserPatch.add_argument('topics', required=True, action='append')


class UserResource(Resource):
    @marshal_with(user_fields)
    def get(self, id=None):
        if (id is None):
            abort(501, message='Listing not available')
        user = db.session.query(User).filter(User.id == id).first()
        if not user:
            abort(404, message="User {} doesn't exist".format(id))
        user.topics = user.topics if user.topics is not None else []
        return user

    @marshal_with(user_fields)
    def post(self, id=None):
        if (id is not None):
            return abort(501, message='Not implemented')
        parsed_args = parserPost.parse_args()
        email = parsed_args['email'].lower()
        if '@' not in parseaddr(email)[1]:
            return abort(422, message='Email is invalid')

        pwd_hash = hashpw(parsed_args['password'].encode('utf-8'), gensalt())
        user = User(email=email, pwd_hash=pwd_hash)
        db.session.add(user)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return abort(409, message='Email must be unique')
        return user

    @marshal_with(user_fields)
    @jwt_required
    def patch(self, id):
        user = db.session.query(User).filter(User.id == id).first()
        if not get_jwt_identity() == user.email:
            abort(401, message='Not authorized')
        if (user is None):
            abort(404, message="User {} doesn't exist".format(id))
        parsed_args = parserPatch.parse_args()
        user.first_name = parsed_args['firstName']
        user.last_name = parsed_args['lastName']
        user.position = parsed_args['position']
        user.about = parsed_args['about']
        user.topics = parsed_args['topics']
        db.session.commit()
        return user, 201
