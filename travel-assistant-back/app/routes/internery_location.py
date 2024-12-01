from flask import current_app as app, jsonify, request
from app.models import Location
from app import db
from app.models import Iternery
from  app.models import iternery_location_association
from flask_jwt_extended import jwt_required, get_jwt_identity

# @app.route('/api/v1/iterneries/<int:iternery_id>/locations/<int:location_id>', methods=['POST'])
# def add_location_to_iternery_with_distance(iternery_id, location_id):
#     data = request.get_json()
#     distance = data.get('distance_from_current_location')

#     if distance is None:
#         return jsonify({"message": "Distance from current location is required"}), 400

#     iternery = Iternery.query.get_or_404(iternery_id)
#     location = Location.query.get_or_404(location_id)

#     # Check if the location is already associated
#     if any(rel.location_id == location_id for rel in db.session.query(iternery_location_association).filter_by(iternery_id=iternery_id).all()):
#         return jsonify({"message": "Location already associated"}), 400

#     # Insert into the association table
#     stmt = iternery_location_association.insert().values(
#         iternery_id=iternery_id,
#         location_id=location_id,
#         distance_from_current_location=distance
#     )
#     db.session.execute(stmt)
#     db.session.commit()

#     return jsonify({"message": f"Location '{location.name}' added to Iternery '{iternery.name}' with distance {distance} km"}), 201


# # GET /api/v1/itinerary_location/<int:id> - Fetch locations by itinerary ID
# @app.route('/api/v1/iternery_location/<int:id>', methods=['GET'])
# def get_iternery_location(id):
#     try:
#         # Query the iternery_location_association table to get locations by itinerary_id
#         itinerary_locations = db.session.query(
#             Location.id, Location.name, Location.type, Location.description,
#             Location.latitude, Location.longitude,
#             iternery_location_association.c.distance_from_current_location
#         ).join(
#             iternery_location_association, iternery_location_association.c.location_id == Location.id
#         ).filter(
#             iternery_location_association.c.iternery_id == id
#         ).all()

#         result = []
#         for location in itinerary_locations:
#             result.append({
#                 "id": location.id,
#                 "name": location.name,
#                 "type": location.type,
#                 "description": location.description,
#                 "latitude": location.latitude,
#                 "longitude": location.longitude,
#                 "distance_from_current_location": location.distance_from_current_location
#             })

#         return jsonify({
#             "locations": result,
#             "message": "Locations for the itinerary retrieved successfully",
#             "code": 200
#         }), 200

#     except Exception as e:
#         return jsonify({
#             "message": str(e),
#             "code": 500
#         }), 500


@app.route('/api/v1/iterneries/<int:iternery_id>/locations/<int:location_id>/<int:user_id>', methods=['POST'])
@jwt_required()
def add_location_to_iternery_with_distance(iternery_id, location_id, user_id):
    data = request.get_json()
    distance = data.get('distance_from_current_location')

    if distance is None:
        return jsonify({"message": "Distance from current location is required"}), 400

    # Fetch itinerary and validate ownership
    iternery = Iternery.query.get_or_404(iternery_id)
    if iternery.user_id != user_id:  # Assuming `user_id` is a field in `Iternery`
        print(f"Current User ID: {user_id}, Itinerary User ID: {iternery.user_id}")
        return jsonify({"message": "Unauthorized to modify this itinerary"}), 403

    location = Location.query.get_or_404(location_id)

    # Check if the location is already associated
    if any(rel.location_id == location_id for rel in db.session.query(iternery_location_association).filter_by(iternery_id=iternery_id).all()):
        return jsonify({"message": "Location already associated"}), 400

    # Insert into the association table
    stmt = iternery_location_association.insert().values(
        iternery_id=iternery_id,
        location_id=location_id,
        distance_from_current_location=distance
    )
    db.session.execute(stmt)
    db.session.commit()

    return jsonify({"message": f"Location '{location.name}' added to Itinerary '{iternery.name}' with distance {distance} km"}), 201


@app.route('/api/v1/itinerary_location/<int:id>/<int:user_id>', methods=['GET'])
@jwt_required()
def get_iternery_location(id, user_id):
    try:
        # Validate that ID and user_id are integers
        if not isinstance(id, int) or not isinstance(user_id, int):
            return jsonify({"message": "Invalid itinerary ID or user ID format", "code": 400}), 400

        # Fetch itinerary and validate ownership
        iternery = Iternery.query.get(id)  # Use get instead of get_or_404 for custom handling
        if not iternery:
            return jsonify({"message": f"Itinerary with ID {id} does not exist", "code": 404}), 404

        if iternery.user_id != user_id:
            return jsonify({"message": "Unauthorized to access this itinerary", "code": 403}), 403

        # Query the itinerary_location_association table to get locations by itinerary_id
        itinerary_locations = db.session.query(
            Location.id, Location.name, Location.type, Location.description,
            Location.latitude, Location.longitude, Location.location_image,
            iternery_location_association.c.distance_from_current_location
        ).join(
            iternery_location_association, iternery_location_association.c.location_id == Location.id
        ).filter(
            iternery_location_association.c.iternery_id == id
        ).all()

        # Check if locations exist for the itinerary
        if not itinerary_locations:
            return jsonify({
                "message": "No locations found for the specified itinerary",
                "code": 404,
                "locations": []
            }), 404

        # Format the result
        result = []
        for location in itinerary_locations:
            result.append({
                "id": location.id,
                "name": location.name,
                "type": location.type,
                "description": location.description,
                "latitude": location.latitude,
                "longitude": location.longitude,
                "location_image": location.location_image,
                "distance_from_current_location": location.distance_from_current_location
            })

        # Return the formatted response
        return jsonify({
            "locations": result,
            "message": "Locations for the itinerary retrieved successfully",
            "code": 200
        }), 200

    except ValueError:
        # Handle invalid data type for id or user_id (not integers)
        return jsonify({"message": "Invalid input: ID and user ID must be integers", "code": 400}), 400

    except SQLAlchemyError as db_err:
        # Handle database errors (e.g., query execution issues)
        return jsonify({"message": f"Database error: {str(db_err)}", "code": 500}), 500

    except Exception as e:
        # General exception for unexpected errors
        return jsonify({
            "message": f"An unexpected error occurred: {str(e)}",
            "code": 500
        }), 500

