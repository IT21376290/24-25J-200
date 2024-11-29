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

@app.route('/api/v1/recipes', methods=['POST'])
@jwt_required()  # Ensures the user is authenticated
def create_recipe():
    try:
        # Get the data from the POST request
        data = request.get_json()

        # Validate required fields
        if not data.get('name') or not data.get('ingredients') or not data.get('instructions'):
            return jsonify({"message": "Missing required fields", "code": 400}), 400

        # Create a new Recipe object
        new_recipe = Recipe(
            name=data['name'],
            description=data.get('description'),  # Optional field for description
            cultural_background=data.get('cultural_background'),
            ingredients=data.get('ingredients'),  # Join the list of ingredients into a string
            instructions=data.get('instructions'),  # Join the list of instructions into a string
            cover_image=data.get('cover_image'),  # Optional field for the cover image
        )

        # Add the new recipe to the database
        db.session.add(new_recipe)
        db.session.commit()

        # Serialize the new recipe (you can use a schema if needed)
        result = {
            "id": new_recipe.id,
            "name": new_recipe.name,
            "description": new_recipe.description,
            "cultural_background":new_recipe.cultural_background,
            "ingredients": new_recipe.ingredients,
            "instructions": new_recipe.instructions,
            "cover_image": new_recipe.cover_image,
        }

        # Return a success response with the created recipe
        response_data = {
            "recipe": result,
            "message": "Recipe created successfully",
            "code": 201
        }

        return jsonify(response_data), 201

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500

    

    # PUT to update a recipe (requires JWT)
@app.route('/api/v1/recipes/<int:id>', methods=['PUT'])
@jwt_required()
def update_recipe(id):
    try:
        recipe = Recipe.query.get(id)
        if not recipe:
            return jsonify({"message": "Recipe not found", "code": 404}), 404

        data = request.get_json()

        if not data.get('name') or not data.get('ingredients') or not data.get('instructions'):
            return jsonify({"message": "Missing required fields", "code": 400}), 400

        recipe.name = data['name']
        recipe.description = data.get('description', recipe.description)
        recipe.cultural_background = data.get('cultural_background')
        recipe.ingredients = data.get('ingredients')
        recipe.instructions = data.get('instructions')
        recipe.cover_image = data.get('cover_image', recipe.cover_image)

        db.session.commit()

        result = RecipeSchema().dump(recipe)

        response_data = {
            "recipe": result,
            "message": "Recipe updated successfully",
            "code": 200
        }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"message": str(e), "code": 500}), 500
