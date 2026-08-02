// ======================================================
// CookCraft JavaScript
// ======================================================

// ==============================================
// Trending Recipes Variables
// ==============================================

// Stores all recipes
let trendingRecipes = [];

// ==============================================
// All Recipes Variables
// ==============================================

// Stores all recipes
let allRecipes = [];

// Number of recipes currently shown
let recipesShown = 3;

// Stores current search results
let searchResults = [];

// Number of search results to display
let searchResultsToShow = 3;

// Current slide number
let currentSlide = 0;

// Number of recipes shown at once
const recipesPerSlide = 3;

// Auto slide every 5 seconds
let autoSlide;


// ======================================================
// Function to Load Trending Recipes
// ======================================================

// ==============================================
// Load Trending Recipes from Flask API
// ==============================================

function loadTrendingRecipes() {

    // Request all trending recipes from Flask
    fetch("/trending")

        // Convert response into JSON
        .then(response => response.json())

        // When recipes are received
        .then(data => {

            // Store every recipe inside our array
            trendingRecipes = data.meals;

            // Show the first 3 recipes
            showTrendingRecipes();

            // Create the slider dots
            createSliderDots();

            // Start automatic sliding every 5 seconds
            autoSlide = setInterval(nextSlide, 5000);

        })

        // Handle errors
        .catch(error => {

            console.error("Error Loading Trending Recipes:", error);

        });

}

// Load recipes when website opens
loadTrendingRecipes();
loadAllRecipes();
// ==============================================
// Show Trending Recipes
// ==============================================

function showTrendingRecipes() {

    // Get the Trending container
    const container = document.getElementById("trending-container");

    // Remove old recipe cards
    container.innerHTML = "";

    // Calculate the starting recipe index
    const start = currentSlide * recipesPerSlide;

    // Calculate the ending recipe index
    const end = start + recipesPerSlide;

    // Get only the recipes for the current slide
    const recipes = trendingRecipes.slice(start, end);

    // Create one card for each recipe
    recipes.forEach(meal => {

        const card = `

        <div class="recipe-card">

            <!-- Popular Badge -->
            <span class="badge">Popular</span>

            <!-- Recipe Image -->
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">

            <!-- Recipe Details -->
            <div class="card-content">

                <h3>${meal.strMeal}</h3>

                <p>${meal.strArea} • ${meal.strCategory}</p>

                <button
                    class="recipe-btn"
                    onclick="viewRecipe('${meal.idMeal}')">

                    View Recipe

                </button>

            </div>

        </div>

        `;

        // Add card to the webpage
        container.innerHTML += card;

    });

    // Update which dot is active
    updateDots();

}
// ==============================================
// Create Slider Dots
// ==============================================

function createSliderDots() {

    // Get the dots container
    const dotsContainer = document.getElementById("slider-dots");

    // Remove old dots
    dotsContainer.innerHTML = "";

    // Calculate total number of slides
    const totalSlides = Math.ceil(trendingRecipes.length / recipesPerSlide);

    // Create one dot for each slide
    for (let i = 0; i < totalSlides; i++) {

        // Create a new span element
        const dot = document.createElement("span");

        // Give it the dot class
        dot.classList.add("dot");

        // Make the first dot active
        if (i === 0) {

            dot.classList.add("active");

        }

        // When user clicks a dot
        dot.addEventListener("click", function () {

            // Change current slide
            currentSlide = i;

            // Show recipes of that slide
            showTrendingRecipes();

        });

        // Add the dot to the webpage
        dotsContainer.appendChild(dot);

    }

}
// ==============================================
// Update Active Dot
// ==============================================

function updateDots() {

    // Get all dots
    const dots = document.querySelectorAll(".dot");

    // Remove active class from every dot
    dots.forEach(dot => {

        dot.classList.remove("active");

    });

    // Highlight current dot
    if (dots[currentSlide]) {

        dots[currentSlide].classList.add("active");

    }

}
// ==============================================
// Next Slide
// ==============================================

function nextSlide() {

    // Total number of slides
    const totalSlides = Math.ceil(trendingRecipes.length / recipesPerSlide);

    // Move to next slide
    currentSlide++;

    // If last slide is reached, go back to first
    if (currentSlide >= totalSlides) {

        currentSlide = 0;

    }

    // Display new recipes
    showTrendingRecipes();

}
// ==============================================
// Previous Slide
// ==============================================

function previousSlide() {

    // Total number of slides
    const totalSlides = Math.ceil(trendingRecipes.length / recipesPerSlide);

    // Move to previous slide
    currentSlide--;

    // If first slide is crossed, go to last slide
    if (currentSlide < 0) {

        currentSlide = totalSlides - 1;

    }

    // Show recipes
    showTrendingRecipes();

}
// ======================================================
// Search Recipe Function
// ======================================================

const searchButton = document.getElementById("search-btn");

searchButton.addEventListener("click", searchRecipe);

function searchRecipe() {

    // Get what the user typed
    const searchText = document.getElementById("search-input").value.trim();

    // Check if search box is empty
    if (searchText === "") {

        alert("Please enter a recipe name.");

        return;

    }

    // Send request to Flask
    fetch(`/search?q=${searchText}`)

        // Convert response into JSON
        .then(response => response.json())

        // Display recipes
        .then(data => {

    console.log("Search API Response:", data);

    // Show recipes
    // Save searched recipes
searchResults = data.meals;

// Show only first 3 initially
searchResultsToShow = 3;

// Display recipes
displaySearchResults(searchResults);
document.querySelector(".view-all").style.display = "inline-block";

    // Wait a moment so the cards are created
    setTimeout(() => {

        document.getElementById("results-container").scrollIntoView({

            behavior: "smooth",
            block: "start"

        });

    }, 100);

})

        // Handle errors
        .catch(error => {

            console.error(error);

        });

}
// ======================================================
// Display Search Results
// ======================================================

function displaySearchResults(meals) {

    // Get Search Results container
    const container = document.getElementById("results-container");

    // Remove old search results
    container.innerHTML = "";

    // If no recipe is found
    if (!meals) {

        container.innerHTML = "<h3>No recipes found.</h3>";

        return;

    }

    // Create one card for each recipe
    meals.slice(0, searchResultsToShow).forEach(meal =>{

        const card = `
        
        <div class="recipe-card">

            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">

            <div class="card-content">

                <h3>${meal.strMeal}</h3>

                <p>${meal.strArea} • ${meal.strCategory}</p>

                <button
    class="recipe-btn"
    onclick="viewRecipe('${meal.idMeal}')">

    View Recipe

</button>
            </div>

        </div>

        `;

        // Add card to Search Results
        container.innerHTML += card;

    });

}
// ======================================================
// View Recipe
// ======================================================

function viewRecipe(mealId) {

    // Send request to Flask using Meal ID
    fetch(`/recipe/${mealId}`)

        // Convert response into JSON
        .then(response => response.json())

        // Use received data
        .then(data => {

            // Get first meal
            const meal = data.meals[0];

            // Fill modal with recipe information
            document.getElementById("modal-image").src = meal.strMealThumb;

            document.getElementById("modal-title").innerText = meal.strMeal;

            document.getElementById("modal-info").innerText =
                `${meal.strCategory} • ${meal.strArea}`;

            document.getElementById("modal-instructions").innerText =
                meal.strInstructions;
 // ==============================================
// Display Ingredients
// ==============================================

// Get the ingredients list
const ingredientsList = document.getElementById("ingredients-list");

// Remove old ingredients
ingredientsList.innerHTML = "";

// Loop through all 20 possible ingredients
for (let i = 1; i <= 20; i++) {

    // Get ingredient and measurement
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    // Skip empty ingredients
    if (ingredient && ingredient.trim() !== "") {

        // Create list item
        const li = document.createElement("li");

        li.innerHTML = `
    <i class="fa-solid fa-check"></i>
    ${measure} ${ingredient}
`;
        // Add to the list
        ingredientsList.appendChild(li);

    }

}

            document.getElementById("youtube-link").href =
                meal.strYoutube;

            // Show the popup
            document.getElementById("recipe-modal").style.display = "block";

        })

        // If something goes wrong
        .catch(error => {

            console.error(error);

        });

}
// ======================================================
// Close Recipe Modal
// ======================================================

// Get Close button
const closeButton = document.querySelector(".close-btn");

if (closeButton) {

    closeButton.addEventListener("click", function () {

        document.getElementById("recipe-modal").style.display = "none";

    });

}
// ==============================================
// Load All Recipes
// ==============================================

function loadAllRecipes() {

    fetch("/all-recipes")

        .then(response => response.json())

        .then(data => {

    // Store all recipes
    allRecipes = data.meals;

    console.log(allRecipes);

    // Display the first recipe
    displayRecipes();

})

        .catch(error => {

            console.error(error);

        });

}
// ==============================================
// Slider Buttons
// ==============================================

const nextBtn = document.getElementById("next-btn");

const prevBtn = document.getElementById("prev-btn");

if (nextBtn) {

    nextBtn.addEventListener("click", nextSlide);

}

if (prevBtn) {

    prevBtn.addEventListener("click", previousSlide);

}
// ==============================================
// Display Recipes
// ==============================================

function displayRecipes() {

    const container = document.getElementById("recipes-container");

    container.innerHTML = "";

    // Show only the first 3 recipes
   for (let i = 0; i < recipesShown && i < allRecipes.length; i++)  {

        const meal = allRecipes[i];

        let recipe = "";

        // -------------------------
        // LEFT TEXT - RIGHT IMAGE
        // -------------------------
        if (i % 2 === 0) {

            recipe = `

            <div class="recipe-box">

                <div class="recipe-text">

                    <h2>${meal.strMeal}</h2>

                    <p class="recipe-info">

                        ${meal.strArea} • ${meal.strCategory}

                    </p>

                    <p class="recipe-description">

                        ${meal.strInstructions.substring(0,150)}...

                    </p>

                    <button
                        class="recipe-btn"
                        onclick="viewRecipe('${meal.idMeal}')">

                        View Recipe

                    </button>

                </div>

                <div class="recipe-image">

                    <img
                        src="${meal.strMealThumb}"
                        alt="${meal.strMeal}">

                </div>

            </div>

            `;

        }

        // -------------------------
        // LEFT IMAGE - RIGHT TEXT
        // -------------------------
        else {

            recipe = `

            <div class="recipe-box">

                <div class="recipe-image">

                    <img
                        src="${meal.strMealThumb}"
                        alt="${meal.strMeal}">

                </div>

                <div class="recipe-text">

                    <h2>${meal.strMeal}</h2>

                    <p class="recipe-info">

                        ${meal.strArea} • ${meal.strCategory}

                    </p>

                    <p class="recipe-description">

                        ${meal.strInstructions.substring(0,150)}...

                    </p>

                    <button
                        class="recipe-btn"
                        onclick="viewRecipe('${meal.idMeal}')">

                        View Recipe

                    </button>

                </div>

            </div>

            `;

        }

        container.innerHTML += recipe;

    }

}

// ==============================================
// Load More Recipes
// ==============================================

// Get the button
const loadMoreBtn = document.getElementById("load-more-btn");

// Check if button exists
if (loadMoreBtn) {

    loadMoreBtn.addEventListener("click", function () {

        // Show 3 more recipes
        recipesShown += 3;

        // Display recipes again
        displayRecipes();

        // Hide button if all recipes are displayed
        if (recipesShown >= allRecipes.length) {

            loadMoreBtn.style.display = "none";

        }

    });

}

// ==============================================
// View All Search Results
// ==============================================

function viewAllResults() {

    document.querySelector(".view-all").classList.add("clicked");

    // Show every searched recipe
    searchResultsToShow = searchResults.length;

    // Refresh Search Results
    displaySearchResults(searchResults);

    // Hide the button after clicking
    document.querySelector(".view-all").style.display = "none";

}