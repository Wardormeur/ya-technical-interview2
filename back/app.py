from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
db_overwrite = os.environ.get('SQLALCHEMY_DATABASE_OVERWRITE')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite' if db_overwrite is None else db_overwrite
app.config['JWT_SECRET_KEY'] = 'Somebodysaidpythonwasmemorysafe'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

from models.User import User    # noqa: E402, F401
db.create_all()
print('Creating the db')

from auth import init    # noqa: E402
jwt = init(app)

from resources.users import UserResource    # noqa: E402
from resources.auth import AuthResource     # noqa: E402
api = Api()
api.add_resource(UserResource, '/api/users', '/api/users/<string:id>', endpoint='user')
api.add_resource(AuthResource, '/api/auth', endpoint='auth')
api.init_app(app)

if __name__ == '__main__':
    app.run(debug=True)
