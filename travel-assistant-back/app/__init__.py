from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(Config)

    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)

    # Import models and routes only after initializing the app
    with app.app_context():
        from app.models import User, Recipe, Iternery, Location, Event, Emergency_Contact
        db.create_all()

        # Register routes
        from app.routes import event_route, itinerary_route, location_route, recipe_route, user_route, emergency_contact_route, user_recipe, location_emergency_contact, internery_location, upload_image_route, insert_route, view_pkl

    return app