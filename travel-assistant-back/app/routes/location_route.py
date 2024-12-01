from flask import current_app as app, jsonify, request
from app.models import Location
from app.schema import LocationSchema
from app import db
from flask_jwt_extended import jwt_required

# GET /api/v1/locations - Fetch all locations
@app.route('/api/v1/locations', methods=['GET'])
@jwt_required()
def get_locations():
    try:
        locations = Location.query.all()
        result = []
        for location in locations:
            result.append({
                "id": location.id,
                "name": location.name,
                "type": location.type,
                "description": location.description,
                "latitude": location.latitude,
                "longitude": location.longitude,
                "location_image":location.location_image
            })
        return jsonify({"locations": result, "message": "Locations retrieved successfully", "code": 200}), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


# GET /api/v1/locations/{id} - Fetch location by ID
@app.route('/api/v1/locations/<int:id>', methods=['GET'])
@jwt_required()
def get_location_by_id(id):
    try:
        location = Location.query.get(id)
        if not location:
            return jsonify({"message": "Location not found", "code": 404}), 404

        result = {
            "id": location.id,
            "name": location.name,
            "type": location.type,
            "description": location.description,
            "latitude": location.latitude,
            "longitude": location.longitude,
            "location_image":location.location_image
        }

        return jsonify({"location": result, "message": "Location retrieved successfully", "code": 200}), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


# POST /api/v1/locations - Create a new location
@app.route('/api/v1/locations', methods=['POST'])
@jwt_required()
def create_location():
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('name') or not data.get('type') or not data.get('description') or not data.get('latitude') or not data.get('longitude') or not data.get('location_image'):
            return jsonify({"message": "Missing required fields", "code": 400}), 400

        # Create a new Location object
        new_location = Location(
            name=data['name'],
            type=data['type'],
            description=data['description'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            location_image=data['location_image']
        )

        # Add the new location to the database
        db.session.add(new_location)
        db.session.commit()

        result = {
            "id": new_location.id,
            "name": new_location.name,
            "type": new_location.type,
            "description": new_location.description,
            "latitude": new_location.latitude,
            "longitude": new_location.longitude,
            "location_image":new_location.location_image
        }

        return jsonify({"location": result, "message": "Location created successfully", "code": 201}), 201
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


# PUT /api/v1/locations/{id} - Update an existing location
@app.route('/api/v1/locations/<int:id>', methods=['PUT'])
@jwt_required()
def update_location(id):
    try:
        location = Location.query.get(id)
        if not location:
            return jsonify({"message": "Location not found", "code": 404}), 404

        data = request.get_json()

        # Update the location fields if provided
        location.name = data.get('name', location.name)
        location.type = data.get('type', location.type)
        location.description = data.get('description', location.description)
        location.latitude = data.get('latitude', location.latitude)
        location.longitude = data.get('longitude', location.longitude)
        location.location_image = data.get('location_image', location.location_image)

        db.session.commit()

        result = {
            "id": location.id,
            "name": location.name,
            "type": location.type,
            "description": location.description,
            "latitude": location.latitude,
            "longitude": location.longitude,
            "location_image":location.location_image
        }

        return jsonify({"location": result, "message": "Location updated successfully", "code": 200}), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


# DELETE /api/v1/locations/{id} - Delete a location by ID
@app.route('/api/v1/locations/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_location(id):
    try:
        location = Location.query.get(id)
        if not location:
            return jsonify({"message": "Location not found", "code": 404}), 404

        # Delete the location
        db.session.delete(location)
        db.session.commit()

        return jsonify({"message": "Location deleted successfully", "code": 200}), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500

