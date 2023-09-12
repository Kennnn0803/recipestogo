const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

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
// Add this code to your existing JavaScript file

// Get the "Open Saved Recipes" button element
const openSavedRecipesBtn = document.getElementById('open-saved-recipes-btn');

// Attach a click event listener to the button
openSavedRecipesBtn.addEventListener('click', openSavedRecipesPopup);

// Function to open the popup and display saved recipes
function openSavedRecipesPopup() {
    // Here, you can create a modal or a new window to display saved recipes.
    // You can also use a library like Bootstrap or a custom CSS modal for better styling.
    
    // For a simple alert box (replace this with your preferred UI):
    alert("Here are your saved recipes:\n\n(Implement your saved recipes display here)");

    // You can retrieve and display saved recipes from localStorage in the modal or new window.
    // Refer to the previous response for how to retrieve saved recipes from localStorage.
}

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
        <button class="save-recipe-btn btn" data-id="${meal.idMeal}">
            Save Recipe
        </button>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

