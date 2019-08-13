from flask_jwt_extended import JWTManager
jwt = None


def init(app):
    jwt = JWTManager(app)
    return jwt
