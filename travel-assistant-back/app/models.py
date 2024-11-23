from . import db


# Association Table between User and Recipe
user_recipe = db.Table(
    'user_recipe',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id'), primary_key=True)
)

# Association Table for Emergency_Contact and Location
emergency_contact_location = db.Table(
    'emergency_contact_location',
    db.Column('emergency_contact_id', db.Integer, db.ForeignKey('emergency__contact.id'), primary_key=True),
    db.Column('location_id', db.Integer, db.ForeignKey('location.id'), primary_key=True)
)

# Association Table
iternery_location_association = db.Table(
    'iternery_location',
    db.Column('iternery_id', db.Integer, db.ForeignKey('iternery.id'), primary_key=True),
    db.Column('location_id', db.Integer, db.ForeignKey('location.id'), primary_key=True),
    db.Column('distance_from_current_location', db.Float, nullable=True)
)


# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    birth_of_date = db.Column(db.Date(), nullable=True)
    country_of_orgin = db.Column(db.String(50), nullable=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    profile_image = db.Column(db.String(150), nullable=True)
    city = db.Column(db.String(50), nullable=True)
    postal_zip = db.Column(db.String(50), nullable=True)
    preferences = db.Column(db.JSON, nullable=True)
    contact_number = db.Column(db.String(100), nullable=True)

    # Many-to-many relationship with Recipe
    recipes = db.relationship(
        'Recipe',
        secondary=user_recipe,
        backref=db.backref('users', lazy='dynamic')
    )

    def __repr__(self):
        return f'<User {self.first_name} {self.last_name}>'


# Recipe Model
class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    cultural_background = db.Column(db.Text, nullable=True)
    ingredients = db.Column(db.JSON, nullable=False)
    instructions = db.Column(db.JSON, nullable=False)
    cover_image = db.Column(db.String(150), nullable=False)
   


# Iternery Model
class Iternery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    total_budget = db.Column(db.Float, nullable=False)
    end_date = db.Column(db.Date(), nullable=False)
    start_date = db.Column(db.Date(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Foreign key to user

    user = db.relationship('User', backref=db.backref('itineraries', lazy=True))

    # Relationship with Location
    locations = db.relationship('Location', secondary=iternery_location_association, backref='iterneries')

    def __repr__(self):
        return f"<Iternery {self.name}>"

# Location Model
class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    location_image = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f"<Location {self.name}>"

# Event Model
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    end_date = db.Column(db.Date(), nullable=False)
    start_date = db.Column(db.Date(), nullable=False)
    cover_image = db.Column(db.String(150), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=True)

    location = db.relationship('Location', backref=db.backref('events', lazy=True))

    def __repr__(self):
        return f"<Event {self.name}>"


# Emergency_Contact Model
class Emergency_Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    contact_number = db.Column(db.Integer, nullable=False)

    # Many-to-many relationship
    locations = db.relationship('Location', secondary=emergency_contact_location, backref=db.backref('emergency_contacts', lazy='dynamic'))

    def __repr__(self):
        return f"<Emergency_Contact {self.name}>"