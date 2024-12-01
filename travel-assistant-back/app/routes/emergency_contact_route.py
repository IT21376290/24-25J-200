from flask import current_app as app, jsonify, request
from flask_jwt_extended import jwt_required
from app.models import db, Emergency_Contact
from app.schema import EmergencyContactSchema
from app import db


# GET ALL Emergency Contacts
@app.route('/api/v1/emergency-contacts', methods=['GET'])
def get_emergency_contacts():
    try:
        # Fetch all emergency contacts
        emergency_contacts = Emergency_Contact.query.all()

        if not emergency_contacts:
            return jsonify({"message": "No emergency contacts found", "code": 404}), 404

        # Serialize the data
        result = EmergencyContactSchema(many=True).dump(emergency_contacts)

        return jsonify({"emergency_contacts": result, "message": "Contacts retrieved successfully", "code": 200}), 200

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


# GET Emergency Contact by ID
@app.route('/api/v1/emergency-contacts/<int:id>', methods=['GET'])
def get_emergency_contact_by_id(id):
    try:
        # Fetch the emergency contact by ID
        contact = Emergency_Contact.query.get(id)

        if not contact:
            return jsonify({"message": "Emergency contact not found", "code": 404}), 404

        # Serialize the data
        result = EmergencyContactSchema().dump(contact)

        return jsonify({"emergency_contact": result, "message": "Contact retrieved successfully", "code": 200}), 200

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


# POST Create Emergency Contact
@app.route('/api/v1/emergency-contacts', methods=['POST'])
@jwt_required()
def create_emergency_contact():
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('name') or not data.get('type') or not data.get('description') or not data.get('contact_number'):
            return jsonify({"message": "Missing required fields", "code": 400}), 400

        # Create a new emergency contact
        new_contact = Emergency_Contact(
            name=data['name'],
            type=data['type'],
            description=data['description'],
            contact_number=data['contact_number']
        )

        db.session.add(new_contact)
        db.session.commit()

        # Serialize the new contact
        result = EmergencyContactSchema().dump(new_contact)

        return jsonify({"emergency_contact": result, "message": "Contact created successfully", "code": 201}), 201

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


# PUT Update Emergency Contact
@app.route('/api/v1/emergency-contacts/<int:id>', methods=['PUT'])
@jwt_required()
def update_emergency_contact(id):
    try:
        data = request.get_json()

        # Fetch the emergency contact by ID
        contact = Emergency_Contact.query.get(id)

        if not contact:
            return jsonify({"message": "Emergency contact not found", "code": 404}), 404

        # Update fields
        contact.name = data.get('name', contact.name)
        contact.type = data.get('type', contact.type)
        contact.description = data.get('description', contact.description)
        contact.contact_number = data.get('contact_number', contact.contact_number)

        db.session.commit()

        # Serialize the updated contact
        result = EmergencyContactSchema().dump(contact)

        return jsonify({"emergency_contact": result, "message": "Contact updated successfully", "code": 200}), 200

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


# DELETE Emergency Contact
@app.route('/api/v1/emergency-contacts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_emergency_contact(id):
    try:
        # Fetch the emergency contact by ID
        contact = Emergency_Contact.query.get(id)

        if not contact:
            return jsonify({"message": "Emergency contact not found", "code": 404}), 404

        db.session.delete(contact)
        db.session.commit()

        return jsonify({"message": "Contact deleted successfully", "code": 200}), 200

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500