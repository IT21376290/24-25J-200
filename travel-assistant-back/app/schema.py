from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from app.models import User, Location, Emergency_Contact, Event, Iternery, Recipe

from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

# User Schema without its ID(Primary key)
class UserSchema(Schema):
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    email = fields.Email(required=True)
    birth_of_date = fields.Date(required=False)
    country_of_orgin = fields.String(required=False)
    username = fields.String(required=False)
    password = fields.String(required=False, load_only=True)  # Exclude from serialization
    profile_image = fields.String(required=False)
    city = fields.String(required=False)
    postal_zip = fields.String(required=False)
    contact_number = fields.String(required=False)


# Recipe Schema
class RecipeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Recipe
        include_fk = True  # Include foreign keys if any
        load_instance = True


# Iternery Schema
class IternerySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Iternery
        include_fk = True
        load_instance = True


# Location Schema
class LocationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Location
        include_fk = True
        load_instance = True


# Event Schema
class EventSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        include_fk = True
        load_instance = True


# Emergency Contact Schema
class EmergencyContactSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Emergency_Contact
        include_fk = True
        load_instance = True