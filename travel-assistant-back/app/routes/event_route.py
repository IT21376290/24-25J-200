from datetime import datetime
from flask import current_app as app, jsonify, request
from flask_jwt_extended import jwt_required
from app.models import Event, Location
from app.schema import EventSchema
from app import db


# GET All Events
@app.route('/api/v1/events', methods=['GET'])
def get_events():
    try:
        events = Event.query.all()
        if not events:
            return jsonify({"message": "No events found", "code": 404}), 404

        result = [{"id": e.id, "name": e.name, "type": e.type, "description": e.description,
                   "start_date": e.start_date, "end_date": e.end_date, "cover_image": e.cover_image} for e in events]

        return jsonify({"events": result, "message": "Events retrieved successfully", "code": 200}), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


# GET Event by ID
@app.route('/api/v1/events/<int:id>', methods=['GET'])
def get_event_by_id(id):
    try:
        event = Event.query.get(id)
        if not event:
            return jsonify({"message": "Event not found", "code": 404}), 404

        result = {"id": event.id, "name": event.name, "type": event.type, "description": event.description,
                  "start_date": event.start_date, "end_date": event.end_date, "cover_image": event.cover_image}

        return jsonify({"event": result, "message": "Event retrieved successfully", "code": 200}), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


@app.route('/api/v1/events', methods=['POST'])
@jwt_required()
def create_event():
    try:
        # Parse the JSON request payload
        data = request.get_json()

        # Validate the required fields
        required_fields = ['name', 'type', 'description', 'start_date', 'end_date', 'location_id', 'cover_image']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                "message": f"Missing required fields: {', '.join(missing_fields)}",
                "code": 400
            }), 400

        # Validate the location_id
        location = Location.query.get(data['location_id'])
        if not location:
            return jsonify({
                "message": f"Location with ID {data['location_id']} not found",
                "code": 404
            }), 404

        # Convert date strings to date objects
        try:
            start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({
                "message": "Invalid date format. Use 'YYYY-MM-DD'.",
                "code": 400
            }), 400

        # Ensure the end_date is after or equal to the start_date
        if end_date < start_date:
            return jsonify({
                "message": "End date cannot be earlier than start date.",
                "code": 400
            }), 400

        # Create a new Event object
        new_event = Event(
            name=data['name'],
            type=data['type'],
            description=data['description'],
            start_date=start_date,
            end_date=end_date,
            location_id=data['location_id'],
            cover_image=data['cover_image']
        )

        # Add and commit the new event to the database
        db.session.add(new_event)
        db.session.commit()

        # Prepare the response
        result = {
            "id": new_event.id,
            "name": new_event.name,
            "type": new_event.type,
            "description": new_event.description,
            "cover_image":new_event.cover_image,
            "start_date": new_event.start_date,
            "end_date": new_event.end_date,
            "location_id": new_event.location_id
        }

        return jsonify({
            "event": result,
            "message": "Event created successfully",
            "code": 201
        }), 201

    except Exception as e:
        # Return a 500 response with the exception message
        return jsonify({"message": str(e), "code": 500}), 500



@app.route('/api/v1/events/<int:id>', methods=['PUT'])
@jwt_required()
def update_event(id):
    try:
        # Parse the JSON payload
        data = request.get_json()

        # Fetch the event by ID
        event = Event.query.get(id)
        if not event:
            return jsonify({"message": "Event not found", "code": 404}), 404

        # Validate and update location_id if provided
        location_id = data.get('location_id', event.location_id)
        if location_id:
            location = Location.query.get(location_id)
            if not location:
                return jsonify({"message": "Invalid location_id. Location not found.", "code": 404}), 404

        # Parse and validate dates if provided
        start_date = event.start_date
        end_date = event.end_date
        if 'start_date' in data:
            try:
                start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"message": "Invalid start_date format. Use 'YYYY-MM-DD'.", "code": 400}), 400
        if 'end_date' in data:
            try:
                end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"message": "Invalid end_date format. Use 'YYYY-MM-DD'.", "code": 400}), 400
        if start_date > end_date:
            return jsonify({"message": "Start date cannot be later than end date.", "code": 400}), 400

        # Update the event with the provided data
        event.name = data.get('name', event.name)
        event.type = data.get('type', event.type)
        event.description = data.get('description', event.description)
        event.cover_image = data.get('cover_image', event.cover_image)
        event.start_date = start_date
        event.end_date = end_date
        event.location_id = location_id

        # Commit changes to the database
        db.session.commit()

        # Prepare the response
        result = {
            "id": event.id,
            "name": event.name,
            "type": event.type,
            "description": event.description,
            "cover_image": event.cover_image,
            "start_date": str(event.start_date),
            "end_date": str(event.end_date),
            "location_id": event.location_id
        }

        return jsonify({"event": result, "message": "Event updated successfully", "code": 200}), 200

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}", "code": 500}), 500


# DELETE Event
@app.route('/api/v1/events/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_event(id):
    try:
        event = Event.query.get(id)
        if not event:
            return jsonify({"message": "Event not found", "code": 404}), 404

        db.session.delete(event)
        db.session.commit()

        return jsonify({"message": "Event deleted successfully", "code": 200}), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500
    

@app.route('/api/v1/events/by_date', methods=['GET'])
@jwt_required()
def get_events_by_date():
    try:
        # Get date from query parameters
        date_str = request.args.get('date')
        print(f"Received date: {date_str}")  # Debugging line

        if not date_str:
            return jsonify({"message": "Date parameter is required", "code": 400}), 400

        # Parse the date string into a datetime object
        try:
            event_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"message": "Invalid date format. Use 'YYYY-MM-DD'.", "code": 400}), 400

        # Fetch events that match the specific date
        events = Event.query.filter(Event.start_date == event_date).all()

        print(f"Found events: {events}")  # Debugging line

        if not events:
            return jsonify({"message": "No events found for this date", "code": 404}), 404

        # Serialize the events
        result = [{"id": e.id, "name": e.name, "type": e.type, "description": e.description,
                   "start_date": e.start_date, "end_date": e.end_date, "cover_image": e.cover_image} for e in events]

        return jsonify({"events": result, "message": "Events retrieved successfully", "code": 200}), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500


@app.route('/api/v1/events/location/<int:location_id>', methods=['GET'])
@jwt_required()
def get_events_by_location(location_id):
    try:
        # Fetch all events associated with the location ID
        events = Event.query.filter_by(location_id=location_id).all()

        if not events:
            return jsonify({"message": "No events found for this location", "code": 404}), 404

        # Serialize the events
        result = [{"id": e.id, "name": e.name, "type": e.type, "description": e.description,
                   "start_date": e.start_date, "end_date": e.end_date, "cover_image": e.cover_image} for e in events]

        return jsonify({"events": result, "message": "Events retrieved successfully", "code": 200}), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500
    

@app.route('/api/v1/events/by_location_and_date', methods=['GET'])
@jwt_required()
def get_events_by_location_and_date():
    try:
        # Get the 'location_id' and 'date' from query parameters
        location_id = request.args.get('location_id', type=int)
        date_str = request.args.get('date')

        # Validate that both parameters are provided
        if not location_id or not date_str:
            return jsonify({"message": "Both 'location_id' and 'date' are required", "code": 400}), 400

        # Parse the 'date' string into a datetime object
        try:
            event_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"message": "Invalid date format. Use 'YYYY-MM-DD'.", "code": 400}), 400

        # Query the events by location_id and event date
        events = Event.query.filter(
            Event.location_id == location_id,
            Event.start_date <= event_date,
            Event.end_date >= event_date
        ).all()

        # If no events are found, return a 404
        if not events:
            return jsonify({"message": "No events found for this location and date", "code": 404}), 404

        # Serialize the events to return as a response
        result = [{"id": e.id, "name": e.name, "type": e.type, "description": e.description,
                   "start_date": str(e.start_date), "end_date": str(e.end_date), "location_id": e.location_id, "cover_image": e.cover_image}
                  for e in events]

        return jsonify({"events": result, "message": "Events retrieved successfully", "code": 200}), 200

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}", "code": 500}), 500
