const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const openSavedRecipesBtn = document.getElementById('open-saved-recipes-btn'); // Add this line

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Event listener for the "Open Saved Recipes" button
openSavedRecipesBtn.addEventListener('click', openSavedRecipesPopup); // Add this line

// Get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        });
}

// Get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals[0]));
    }
}


// Function to open the popup and display saved recipes
function openSavedRecipesModal() {
    // Retrieve saved recipes from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes'));

    // Get the modal and links elements
    const modal = document.getElementById('saved-recipes-modal');
    const savedRecipesModalLinks = document.getElementById('saved-recipes-modal-links');

    // Clear previous links in the modal
    savedRecipesModalLinks.innerHTML = '';

    if (savedRecipes && savedRecipes.length > 0) {
        // Create clickable links for saved recipes
        savedRecipes.forEach(recipe => {
            const recipeLink = document.createElement('a');
            recipeLink.href = recipe.video; // Use the video link as the href
            recipeLink.target = '_blank'; // Open link in a new tab
            recipeLink.textContent = recipe.name; // Display recipe name as the link text
            savedRecipesModalLinks.appendChild(recipeLink);
            savedRecipesModalLinks.appendChild(document.createElement('br')); // Add line break
        });

        // Display the modal
        modal.style.display = 'block';
    } else {
        alert('You have no saved recipes yet.');
    }
}

// Event listener for the "Open Saved Recipes" button
openSavedRecipesBtn.addEventListener('click', openSavedRecipesModal);


// Create a modal
function mealRecipeModal(meal) {
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Video Tutorial Here!</a>
        </div>
    `;

    // Add a Save Recipe button inside the modal
    html += `
        <button class="save-recipe-btn btn" data-id="${meal.idMeal}">
            Save Recipe
        </button>
    `;

    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');

    // Save the recipe to localStorage when the "Save Recipe" button is clicked
    const saveRecipeBtn = document.querySelector('.save-recipe-btn');
    saveRecipeBtn.addEventListener('click', () => {
        // Retrieve existing saved recipes from localStorage or initialize an empty array
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

        // Add the current recipe to the savedRecipes array
        savedRecipes.push({
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory,
            instructions: meal.strInstructions,
            image: meal.strMealThumb,
            video: meal.strYoutube,
        });

        // Save the updated savedRecipes array back to localStorage
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));

        alert('Recipe saved successfully!');
    });
}


