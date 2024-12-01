from flask import current_app as app, request, jsonify, url_for
from werkzeug.utils import secure_filename
import os
from config import Config

@app.route('/api/v1/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and Config.allowed_file(file.filename):
        filename = secure_filename(file.filename)

        file_path = os.path.join(app.root_path, 'static', 'uploads', filename)
        
        if not os.path.exists(os.path.dirname(file_path)):
            os.makedirs(os.path.dirname(file_path))

        file.save(file_path)

        image_url = request.host_url + url_for('static', filename=f'uploads/{filename}')

        return jsonify({"message": "File uploaded successfully", "image_url": image_url}), 200
    else:
        return jsonify({"error": "File type not allowed"}), 400
