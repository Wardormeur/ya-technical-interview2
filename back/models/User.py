from app import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    email = db.Column(db.String(40), unique=True, nullable=False)
    first_name = db.Column(db.String(40))
    last_name = db.Column(db.String(40))
    pwd_hash = db.Column(db.String(80), nullable=False)
    position = db.Column(db.String(64))
    about = db.Column(db.String(255))
    topics = db.Column(db.PickleType())
