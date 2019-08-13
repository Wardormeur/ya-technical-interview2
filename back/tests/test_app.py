import pytest
import json
import os
os.environ['SQLALCHEMY_DATABASE_OVERWRITE'] = 'sqlite:///db.test.sqlite'
from app import app, db

user_payload = dict(email="test@test.com", password="abc") 
profile_payload = dict(firstName='John', lastName='Doe', position='DM', about='If it can beat you, it will', topics=['Topic 1'])

@pytest.fixture
def client():
    with app.app_context():   
        db.create_all()
        yield app.test_client()
        db.drop_all()
    os.unlink('./db.test.sqlite')

def test_no_users(client):
    res = client.get('/api/users/0')
    assert res.status_code == 404 
    assert b'User 0 doesn\'t exist' in res.data

def test_valid_register_user(client):
    res = client.post('/api/users', data=json.dumps(user_payload), content_type='application/json')
    expected = dict(id=1, firstName=None, lastName=None, position=None, about=None, topics=None)
    assert json.loads(res.data) == expected

def test_invalid_register_duplicate_email(client):
    client.post('/api/users', data=json.dumps(user_payload), content_type='application/json')
    res = client.post('/api/users', data=json.dumps(user_payload), content_type='application/json')
    assert res.status_code == 409

def test_invalid_register_email(client):
    payload = dict(email='notemail', password='dubidu')
    res = client.post('/api/users', data=json.dumps(payload), content_type='application/json')
    assert res.status_code == 422 

def test_valid_login(client):
    client.post('/api/users', data=json.dumps(user_payload), content_type='application/json')
    res = client.post('/api/auth', data=json.dumps(user_payload), content_type='application/json')
    assert res.status_code == 200
    assert json.loads(res.data).get('token') is not None

def test_valid_case_login(client):
    payload = user_payload
    client.post('/api/users', data=json.dumps(user_payload), content_type='application/json')
    payload['email']= 'Test@Test.com'
    res = client.post('/api/auth', data=json.dumps(payload), content_type='application/json')
    assert res.status_code == 200
    assert json.loads(res.data).get('token') is not None

def test_invalid_password_login(client):
    client.post('/api/users', data=json.dumps(user_payload), content_type='application/json')
    res = client.post('/api/auth', data='{"email": "test@test.com", "password": "qsdds"}', content_type='application/json')
    assert res.status_code == 401 

def test_invalid_user_login(client):
    client.post('/api/users', data=json.dumps(user_payload), content_type='application/json')
    res = client.post('/api/auth', data='{"email": "mememe@example.com", "password": "qsdds"}', content_type='application/json')
    assert res.status_code == 404 

def test_valid_update_profile(client):
    res = client.post('/api/users', data=json.dumps(user_payload), content_type='application/json')
    id = (json.loads(res.data)).get('id')
    res = client.post('/api/auth', data=json.dumps(user_payload), content_type='application/json')
    token = json.loads(res.data).get('token')
    res = client.patch('/api/users/{}'.format(id), headers={'Authorization': 'Bearer {}'.format(token)}, data=json.dumps(profile_payload), content_type='application/json')
    assert json.loads(res.data) == dict(id=1, firstName='John', lastName='Doe', position='DM', about='If it can beat you, it will', topics=["Topic 1"]) 

def test_invalid_update_profile(client):
    user2 = dict(email='other@example.com', password='Stuff')
    # Requesting user
    res = client.post('/api/users', data=json.dumps(user2), content_type='application/json')
    res = client.post('/api/auth', data=json.dumps(user2), content_type='application/json')
    token = json.loads(res.data).get('token')
    # Requested user
    res = client.post('/api/users', data=json.dumps(user_payload), content_type='application/json')
    id = (json.loads(res.data)).get('id')
    res = client.patch('/api/users/{}'.format(id), headers={'Authorization': 'Bearer {}'.format(token)}, data=json.dumps(profile_payload), content_type='application/json')
    assert res.status_code == 401 
