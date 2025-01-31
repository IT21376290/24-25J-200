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
 return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500
    

@app.route('/api/v1/recipes/<int:id>', methods=['GET'])
def get_recipe_by_id(id):
    try:
        # Fetch the recipe by ID from the database
        recipe = Recipe.query.get(id)

        # Check if the recipe exists
        if not recipe:
            return jsonify({"message": "Recipe not found", "code": 404}), 404

        # Serialize the recipe using RecipeSchema
        result = RecipeSchema().dump(recipe)

        response_data = {
            "recipe": result,
            "message": "Recipe retrieved successfully",
            "code": 200
        }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500

