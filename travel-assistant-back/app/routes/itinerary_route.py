from flask import current_app as app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import Iternery
from app.schema import IternerySchema
from app import db


@app.route('/api/v1/itineraries', methods=['GET'])
@jwt_required()
def get_itineraries():
    try:
        # Fetch all itineraries
        itineraries = Iternery.query.all()

        # Serialize the itineraries
        result = IternerySchema(many=True).dump(itineraries)

        response_data = {
            "itineraries": result,
            "message": "Itineraries retrieved successfully",
            "code": 200
        }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


@app.route('/api/v1/itineraries/<int:id>', methods=['GET'])
@jwt_required()
def get_itinerary_by_id(id):
    try:
        # Fetch the itinerary by ID
        itinerary = Iternery.query.get(id)

        if not itinerary:
            return jsonify({"message": "Itinerary not found", "code": 404}), 404

        # Serialize the itinerary
        result = IternerySchema().dump(itinerary)

        response_data = {
            "itinerary": result,
            "message": "Itinerary retrieved successfully",
            "code": 200
        }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


@app.route('/api/v1/itineraries', methods=['POST'])
@jwt_required()
def create_itinerary():
    try:
        # Get the logged-in user's identity (email or user ID)
        current_user = get_jwt_identity()

        # Get the data from the request
        data = request.get_json()

        # Validate the data
        if not data.get('name') or not data.get('total_budget') or not data.get('start_date') or not data.get('end_date'):
            return jsonify({"message": "Missing required fields", "code": 400}), 400

        # Create a new Itinerary
        new_itinerary = Iternery(
            name=data['name'],
            total_budget=data['total_budget'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            user_id=data['user_id']
        )

        db.session.add(new_itinerary)
        db.session.commit()

        # Serialize the new itinerary
        result = IternerySchema().dump(new_itinerary)

        response_data = {
            "itinerary": result,
            "message": "Itinerary created successfully",
            "code": 201
        }

        return jsonify(response_data), 201

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500



@app.route('/api/v1/itineraries/<int:id>', methods=['PUT'])
@jwt_required()
def update_itinerary(id):
    try:
        # Fetch the itinerary
        itinerary = Iternery.query.get(id)

        if not itinerary:
            return jsonify({"message": "Itinerary not found", "code": 404}), 404

        # Get the data from the request
        data = request.get_json()

        # Update itinerary fields
        itinerary.name = data.get('name', itinerary.name)
        itinerary.total_budget = data.get('total_budget', itinerary.total_budget)
        itinerary.start_date = data.get('start_date', itinerary.start_date)
        itinerary.end_date = data.get('end_date', itinerary.end_date)
        itinerary.user_id = data.get('user_id', itinerary.user_id)

        db.session.commit()

        # Serialize the updated itinerary
        result = IternerySchema().dump(itinerary)

        response_data = {
            "itinerary": result,
            "message": "Itinerary updated successfully",
            "code": 200
        }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500



@app.route('/api/v1/itineraries/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_itinerary(id):
    try:
        # Fetch the itinerary
        itinerary = Iternery.query.get(id)

        if not itinerary:
            return jsonify({"message": "Itinerary not found", "code": 404}), 404

        # Delete the itinerary
        db.session.delete(itinerary)
        db.session.commit()

        response_data = {
            "message": "Itinerary deleted successfully",
            "code": 200
        }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


@app.route('/api/v1/itinerary/<int:user_id>', methods=['GET'])
@jwt_required()
def get_itinerary_by_user(user_id):
    try:
        # Fetch the itinerary for the given user_id
        itineraries = Iternery.query.filter(Iternery.user_id == user_id).all()

        # Check if no itineraries are found
        if not itineraries:
            return jsonify({"message": "No itineraries found for this user", "code": 404}), 404

        # Serialize the itinerary data
        result = [{"id": itinerary.id, "name": itinerary.name, "total_budget": itinerary.total_budget,
                   "start_date": itinerary.start_date, "end_date": itinerary.end_date} for itinerary in itineraries]

        return jsonify({"itineraries": result, "message": "Itineraries retrieved successfully", "code": 200}), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500