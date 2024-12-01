from flask import current_app as app, jsonify, request,Response


import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from io import BytesIO
import joblib



# Resolve the absolute path of the .pkl file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PKL_FILE_PATH = os.path.join(BASE_DIR, '../../knn_model.pkl')

@app.route('/api/v1/view-pkl-pdf')
def view_pkl_pdf():
    if not os.path.exists(PKL_FILE_PATH):
        return jsonify({"error": "File not found"}), 404

    try:
        # Load the trained model
        with open(PKL_FILE_PATH, 'rb') as file:
            knn_model = joblib.load(file)

        # Mock-up accuracy and training details (replace with actual details)
        accuracy = "Accuracy: 95%"  # Placeholder for accuracy
        model_details = (
            "Model: K-Nearest Neighbors (KNN)\n"
            "Neighbors: 5\n"
            "Distance Metric: Euclidean\n"
            "Training Data: Tourist places dataset\n"
        )

        # Create a byte stream buffer to store the PDF
        buffer = BytesIO()

        # Create a document template with ReportLab
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []

        # Set up styles for the PDF content
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'Title',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=16,
            spaceAfter=12,
            textColor=colors.black
        )
        body_style = ParagraphStyle(
            'BodyText',
            parent=styles['Normal'],
            fontSize=12,
            leading=15,
            textColor=colors.black
        )
        section_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            spaceAfter=6,
            textColor=colors.darkblue
        )

        # Add a title to the document
        story.append(Paragraph("<b>Model Training Details</b>", title_style))
        story.append(Spacer(1, 12))

        # Add model training details
        story.append(Paragraph(f"<b>Model Type:</b> K-Nearest Neighbors (KNN)", body_style))
        story.append(Spacer(1, 6))
        story.append(Paragraph(f"<b>Neighbors:</b> 5", body_style))
        story.append(Spacer(1, 6))
        story.append(Paragraph(f"<b>Distance Metric:</b> Euclidean", body_style))
        story.append(Spacer(1, 6))
        story.append(Paragraph(f"<b>Training Data:</b> Tourist places dataset", body_style))
        story.append(Spacer(1, 12))

        # Add accuracy
        story.append(Paragraph("<b>Model Accuracy:</b>", section_style))
        story.append(Spacer(1, 6))
        story.append(Paragraph(f"{accuracy}", body_style))
        story.append(Spacer(1, 12))

        # Add a section for model pickle data (showing the first 500 characters)
        story.append(Paragraph("<b>Model Data (first 500 chars):</b>", section_style))
        story.append(Spacer(1, 6))
        model_data = str(knn_model)[:500]  # Just show the first 500 characters
        story.append(Paragraph(model_data, body_style))
        story.append(Spacer(1, 12))

        # Create the PDF
        doc.build(story)

        # Go to the start of the StringIO buffer
        buffer.seek(0)

        # Return the PDF as a response
        return Response(
            buffer.getvalue(),
            content_type="application/pdf",
            headers={
                "Content-Disposition": "inline; filename=pickle_data.pdf"
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

