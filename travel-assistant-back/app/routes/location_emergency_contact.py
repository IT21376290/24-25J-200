from flask import current_app as app, jsonify, request
from app import db
from app.models import Emergency_Contact, Location
from flask_jwt_extended import jwt_required, get_jwt_identity


# Add a Relationship (Location to Emergency Contact)
@app.route('/api/v1/emergency_contacts/<int:emergency_contact_id>/locations/<int:location_id>', methods=['POST'])
@jwt_required()
def add_location_to_emergency_contact(emergency_contact_id, location_id):
    current_user = get_jwt_identity()  # Get the current authenticated user

    emergency_contact = Emergency_Contact.query.get_or_404(emergency_contact_id)
    location = Location.query.get_or_404(location_id)

    # Add location to emergency contact
    if location not in emergency_contact.locations:
        emergency_contact.locations.append(location)
        db.session.commit()
        return jsonify({"message": f"Location '{location.name}' added to Emergency Contact '{emergency_contact.name}'"}), 201

    return jsonify({"message": "Location already associated"}), 400


@app.route('/api/v1/emergency_contacts/<int:emergency_contact_id>/locations', methods=['GET'])
def list_locations_for_emergency_contact(emergency_contact_id):
    # Fetch the emergency contact or return 404 if not found
    emergency_contact = Emergency_Contact.query.get_or_404(emergency_contact_id)

    if not emergency_contact:
        return jsonify({"error": "Emergency Contact not found", "id": emergency_contact_id}), 404

    # Format the emergency contact details
    contact_details = {
        "id": emergency_contact.id,
        "name": emergency_contact.name, 
        "type":emergency_contact.type,
        "description":emergency_contact.description,
        "phone": emergency_contact.contact_number,  
    }

    # Retrieve and format the related locations
    locations = [
        {
            "id": location.id,
            "name": location.name,
            "type": location.type,
            "latitude": location.latitude,
            "longitude": location.longitude,
            "location_image": location.location_image
        }
        for location in emergency_contact.locations
    ]

    # Combine both into the response
    response = {
        "emergency_contact": contact_details,
        "locations": locations
    }

    return jsonify(response), 200



# Remove a Relationship (Location from Emergency Contact)
@app.route('/api/v1/emergency_contacts/<int:emergency_contact_id>/locations/<int:location_id>', methods=['DELETE'])
@jwt_required()
def remove_location_from_emergency_contact(emergency_contact_id, location_id):
    current_user = get_jwt_identity()  # Get the current authenticated user

    emergency_contact = Emergency_Contact.query.get_or_404(emergency_contact_id)
    location = Location.query.get_or_404(location_id)

    if location in emergency_contact.locations:
        emergency_contact.locations.remove(location)
        db.session.commit()
        return jsonify({"message": f"Location '{location.name}' removed from Emergency Contact '{emergency_contact.name}'"}), 200

    return jsonify({"message": "Location not associated"}), 400
