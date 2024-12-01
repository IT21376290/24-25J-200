from flask import current_app as app, jsonify, request
from sqlalchemy import and_
from app.models import Recipe, User, user_recipe
from app import db
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import aliased

# Add a Recipe to a User
@app.route('/api/v1/users/<int:user_id>/recipes/<int:recipe_id>', methods=['POST'])
@jwt_required()
def add_recipe_to_user(user_id, recipe_id):
    user = User.query.get_or_404(user_id)
    recipe = Recipe.query.get_or_404(recipe_id)

    # Check if the relationship already exists in user_recipe
    existing_link = db.session.execute(
        db.select(user_recipe)
        .where(user_recipe.c.user_id == user_id)
        .where(user_recipe.c.recipe_id == recipe_id)
    ).first()

    if not existing_link:
        user.recipes.append(recipe)
        db.session.commit()
        return jsonify({"message": f"Recipe '{recipe.name}' added to user '{user.first_name} {user.last_name}'"}), 200

    return jsonify({"message": "Recipe already added"}), 400


# Remove a Recipe from a User
@app.route('/api/v1/users/<int:user_id>/recipes/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def remove_recipe_from_user(user_id, recipe_id):
    # Ensure the recipe is associated with the user
    existing_link = db.session.execute(
        db.select(user_recipe)
        .where(user_recipe.c.user_id == user_id)
        .where(user_recipe.c.recipe_id == recipe_id)
    ).first()

    if existing_link:
        user = User.query.get(user_id)
        recipe = Recipe.query.get(recipe_id)
        user.recipes.remove(recipe)
        db.session.commit()
        return jsonify({"message": f"Recipe '{recipe.name}' removed from user '{user.first_name} {user.last_name}'"}), 200

    return jsonify({"message": "Recipe not associated with user"}), 400




from sqlalchemy.exc import SQLAlchemyError

@app.route('/api/v1/users/<int:user_id>/recipes', methods=['GET'])
@jwt_required()
def list_recipes_for_user(user_id):
    try:
        # Fetch the user or return a clear 404 response
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "error": "User not found",
                "message": f"No user exists with ID: {user_id}",
                "code": 404
            }), 404

        app.logger.info(f"User found: {user.first_name} {user.last_name} (ID: {user.id})")

        # Join recipes with user_recipe table and filter by user_id
        recipes = db.session.query(
            Recipe.id, Recipe.name, Recipe.description, Recipe.cultural_background, 
            Recipe.ingredients, Recipe.instructions, Recipe.cover_image
        ).join(
            user_recipe
        ).filter(
            and_(
                user_recipe.c.user_id == user.id,
                user_recipe.c.recipe_id == Recipe.id
            )
        ).all()

        # Format the result
        result = [
            {
                "id": recipe.id,
                "name": recipe.name,
                "description": recipe.description,
                "cultural_background": recipe.cultural_background,
                "ingredients": recipe.ingredients,
                "instructions": recipe.instructions,
                "cover_image": recipe.cover_image,
            }
            for recipe in recipes
        ]

        return jsonify({
            "recipes": result,
            "message": "Recipes for the user retrieved successfully",
            "code": 200
        }), 200

    except SQLAlchemyError as db_error:
        app.logger.error(f"Database error occurred: {str(db_error)}")
        return jsonify({
            "error": "Database error",
            "message": "An error occurred while querying the database.",
            "code": 500
        }), 500

    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": f"An unexpected error occurred: {str(e)}",
            "code": 500
        }), 500




# List All Users for a Recipe
@app.route('/api/v1/recipes/<int:recipe_id>/users', methods=['GET'])
@jwt_required()
def list_users_for_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    users = [{"id": user.id, "name": f"{user.first_name} {user.last_name}"} for user in recipe.users]
    return jsonify(users), 200
