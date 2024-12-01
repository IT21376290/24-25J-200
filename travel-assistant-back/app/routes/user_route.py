from datetime import datetime, timedelta
from flask import current_app as app, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from app.models import User
from app.schema import UserSchema
from app import db
import bcrypt

@app.route('/')
def hi():
    return 'Hello, World!'

# Register Endpoint
@app.route('/api/v1/register', methods=['POST'])
def register():
    data = request.get_json()

    # Extract fields from request
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    # Validate mandatory fields
    if not username or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    # Check if email or username is already registered
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400
    if username and User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already taken"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Create a new user instance
    new_user = User(
        email=email,
        password=hashed_password,
        username=username,
    )

    # Save the user to the database
    db.session.add(new_user)
    db.session.commit()


    registration_token = create_access_token(identity=new_user.email, expires_delta=timedelta(minutes=30))

    return jsonify({
        "message": "User registered successfully",
        "user_id": new_user.id,
        "access_token": registration_token
    }), 201



@app.route('/api/v1/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    # Find user by email
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    # Hash the entered password and compare with stored hash
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"message": "Invalid email or password"}), 401

    # Generate a new JWT token
    access_token = create_access_token(identity=user.email, expires_delta=timedelta(hours=1))

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user_id": user.id
    }), 200




@app.route('/api/users/<int:user_id>', methods=['GET'])
@jwt_required()  # Require a valid JWT token
def get_user(user_id):
    
    # Retrieve the identity of the logged-in user from the token
    current_user_email = get_jwt_identity()

    # Optionally, you can add further checks (e.g., user permissions)
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({"message": "Unauthorized access"}), 403

    # Query the requested user by ID
    requested_user = User.query.get(user_id)

    if not requested_user:
        return jsonify({"message": "User not found"}), 404

    # Return requested user details
    return jsonify({
        "id": requested_user.id,
        "first_name": requested_user.first_name,
        "last_name": requested_user.last_name,
        "email": requested_user.email,
        "username": requested_user.username,
        "birth_of_date": requested_user.birth_of_date.isoformat() if requested_user.birth_of_date else None,
        "country_of_orgin": requested_user.country_of_orgin,
        "profile_image": requested_user.profile_image,
        "preferences": requested_user.preferences,
        "city": requested_user.city,
        "postal_zip": requested_user.postal_zip,
        "contact_number": requested_user.contact_number,
    }), 200




@app.route('/api/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    # Get the logged-in user's email from the JWT
    current_user_email = get_jwt_identity()

    # Retrieve the logged-in user from the database
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user:
        return jsonify({"message": "Unauthorized access"}), 403

    # Fetch the user to be updated
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Optional: Allow only self-updates
    if current_user.id != user_id:
        return jsonify({"message": "You can only update your own profile"}), 403

    # Parse the JSON request body
    data = request.get_json()

    # Update fields if provided
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.username = data.get('username', user.username)
    user.city = data.get('city', user.city)
    user.postal_zip = data.get('postal_zip', user.postal_zip)
    user.country_of_orgin = data.get('country_of_orgin', user.country_of_orgin)
    user.profile_image = data.get('profile_image', user.profile_image)
    user.preferences = data.get('preferences', user.preferences)
    user.contact_number = data.get('contact_number', user.contact_number)

    # Update birth_of_date if provided and valid
    if 'birth_of_date' in data:
        try:
            user.birth_of_date = datetime.strptime(data['birth_of_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"message": "Invalid date format for birth_of_date (use YYYY-MM-DD)"}), 400

    # Update password if provided (plain text)
    if 'password' in data:
        user.password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    # Save changes to the database
    try:
        db.session.commit()
        return jsonify({
            "message": "User updated successfully",
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "username": user.username,
                "birth_of_date": user.birth_of_date,
                "city": user.city,
                "postal_zip": user.postal_zip,
                "country_of_orgin": user.country_of_orgin,
                "profile_image": user.profile_image,
                "preferences": user.preferences,
                "contact_number":user.contact_number,
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while updating the user", "error": str(e)}), 500


@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    # Get the logged-in user's email from the JWT
    current_user_email = get_jwt_identity()

    # Retrieve the logged-in user from the database
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user:
        return jsonify({"message": "Unauthorized access"}), 403

    # Fetch the user to be deleted
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Optional: Add logic to allow only self-deletion or admin permissions
    if current_user.id != user_id:
        return jsonify({"message": "You can only delete your own profile"}), 403

    # Delete the user from the database
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while deleting the user", "error": str(e)}), 500
