# How to 
This has been tested using `venv`. It would be recommended to do the same.

`rm db.sqlite` to reset the db
`pip install -e .` to install the deps
`flake8 --exclude venv` to lint the project
`flask run` to run the API
`python -m pytest tests/` to integration test the API

## Librairies used
 - Flask: all ine one HTTP-server, relatively straightforward to dev with 
 - Flask-restful: wrapper around a SQLAlchemy model to make "restful" endpoints
 - Flask-jwt-extended: wrapper for pyJWT to avoid mistakes on the JWT specs
 - bcrypt: password hashing without external storage of the seed, keep your model clean !
### Dev
 - flake8: linting
 - pdb: debugging
 - pytest: tests

## Known issues

 - Usage of sqlite:
   - as a POC, we give up on concurrency on write for ease of demo. Setting up docker-compose would have been a bit too much 
   - no UUID for the user id, because sqlite doesnt support it
   - pickleType since json/array isn't supported by sqlite
 - No way to change the pwd post-creation
   - this requires a verification process of the user
 - Credentials & user share the same resource
   - because that's simpler and we don't have multiple auth schema that justify another entity
   - but the REST API is deformed by it: as such a POST can be partial as long as the email is there; technically, the auth is then a representation of the same element
   - also because theoratically the email is used to get the avatar out (gravatar), so the delimitation between auth and profile is blurred
 - Cyclic dep with the db/model
 - Configuration overwrite is passable. Providing a conf object would be better, but that's only a one-liner right now
 - No units tests. If there is one type of test that can do all for a POC, it's integration tests.
 - It's more of an HTTP API than a RESTFUL API. But eh, it has been powering the web for years now, so... good enough?
 - No separation of dev-deps with production-deps.
 - I would not reuse flask-restful. There are better solutions nowadays it seems that would integrate more seemlessly (SQLAlchemy+marshmallows+..) than the limitations I've encountered. Even flask-restplus is more active (Github)

## Choices (against specs)
 - FirstName/LastName vs Name: too often required for messaging to only require the first name
 - Email is saved. Elsewhat how do we match the auth ?
 - No real email validation in the backend. Only way to do so is to send an email to verify it
 - no password restriction (8 char, 1 digit, 1 special.. 2FA ?)
 - Nothing much said about what "Topics" are: currently hardcoded in the front since the design doesn't seem to let you create new ones
 - No proper validation of the API: you can send 'Topic 42' as a value, it would be valid. You can also send a value too large (about field, position field) and only the DB will reject it.


## TODO
 - Use migrations instead of manual setup 
