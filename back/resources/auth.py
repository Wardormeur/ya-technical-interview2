from app import db
from models.User import User
from flask import abort
from flask_restful import reqparse, Resource
from bcrypt import checkpw
from flask_jwt_extended import create_access_token


parser = reqparse.RequestParser()
parser.add_argument('email', required=True)
parser.add_argument('password', required=True)


class AuthResource(Resource):
    def post(self):
        parsed_args = parser.parse_args()
        email = parsed_args['email'].lower()
        password = parsed_args['password'].encode('utf-8')
        user = db.session.query(User).filter(User.email == email).first()
        if user is None:
            abort(404, 'Nobody registred under that name')
        if not checkpw(password, user.pwd_hash):
            abort(401, 'Bad username or password')

        access_token = create_access_token(identity=email)
        return dict(id=user.id, token=access_token)
