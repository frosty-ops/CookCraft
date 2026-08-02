# ==========================================================
# CookCraft - AI Recipe Finder
# Flask Backend
# ==========================================================

# Import Flask modules
from flask import Flask, render_template, jsonify, request
import requests

# Create Flask application
app = Flask(__name__)


# ==========================================================
# Home Page
# ==========================================================
@app.route("/")
def home():

    # Open index.html
    return render_template("index.html")


# ==========================================================
# Trending Recipes API
# ==========================================================
@app.route("/trending")
def trending():

    # TheMealDB API URL
    url = "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken"

    # Send GET request
    response = requests.get(url)

    # Convert JSON response into Python dictionary
    data = response.json()

    # Return JSON to JavaScript
    return jsonify(data)
# ==========================================================
# Search Recipes API
# ==========================================================

@app.route("/search")
def search_recipe():

    # Get the recipe name from the search box
    recipe_name = request.args.get("q")

    # Create API URL
    url = f"https://www.themealdb.com/api/json/v1/1/search.php?s={recipe_name}"

    # Send request to TheMealDB
    response = requests.get(url)

    # Convert response into JSON
    data = response.json()

    # Send data back to JavaScript
    return jsonify(data)
# ==========================================
# All Recipes
# ==========================================

@app.route("/all-recipes")
def all_recipes():

    url = "https://www.themealdb.com/api/json/v1/1/search.php?s="

    response = requests.get(url)

    data = response.json()

    return jsonify(data)
# ==========================================================
# Recipe Details API
# ==========================================================

@app.route("/recipe/<meal_id>")
def recipe_details(meal_id):

    # API URL using Meal ID
    url = f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal_id}"

    # Request data
    response = requests.get(url)

    # Convert JSON
    data = response.json()

    # Return to JavaScript
    return jsonify(data)

# ==========================================================
# Run Flask
# ==========================================================
if __name__ == "__main__":
   app.run(host="0.0.0.0", port=5000, debug=True)