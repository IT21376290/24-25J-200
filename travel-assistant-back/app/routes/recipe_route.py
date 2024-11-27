# app/routes.py
from flask import current_app as app, jsonify, request
from app.models import Recipe
from app.schema import RecipeSchema
from app import db
from flask_jwt_extended import get_jwt_identity, jwt_required

@app.route('/api/v1/recipes', methods=['GET'])
def get_recipes():
    try:
        # Fetch all recipes from the database
        recipes = Recipe.query.all()

        # Serialize the recipes using RecipeSchema
        result = RecipeSchema(many=True).dump(recipes)

        response_data = {
            "recipes": result,
            "message": "Recipes retrieved successfully",
            "code": 200
        }
