const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const openSavedRecipesBtn = document.getElementById('open-saved-recipes-btn'); // Add this line

searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// open save recipe
openSavedRecipesBtn.addEventListener('click', openSavedRecipesPopup);

// splash screen
window.addEventListener('load', function () {
    // delay 
    setTimeout(function () {
        document.getElementById('splash-screen').style.opacity = '0';
        document.getElementById('app-content').style.display = 'block';
        setTimeout(function () {
            document.getElementById('splash-screen').remove();
        }, 1000); 
    }, 3000); 
});

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

// recipe
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals[0]));
    }
}
openSavedRecipesBtn.addEventListener('click', openSavedRecipesModal);
function openSavedRecipesPopup() {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes'));

    if (savedRecipes && savedRecipes.length > 0) {
        let savedRecipesText = 'Your saved recipes:\n\n';
        savedRecipes.forEach(recipe => {
            savedRecipesText += `Name: ${recipe.name}\nCategory: ${recipe.category}\n`;
            if (recipe.video) {
                savedRecipesText += `Video Link: ${recipe.video}\n`;
            }
            
            savedRecipesText += '\n';
        });

        alert(savedRecipesText);
    } else {
        alert('You have no saved recipes yet.');
    }
}
// para sa modal
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
    // sa loob nung modal
    html += `
        <button class="save-recipe-btn btn" data-id="${meal.idMeal}">
            Save Recipe
        </button>
    `;

    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
    // local storage
    const saveRecipeBtn = document.querySelector('.save-recipe-btn');
    saveRecipeBtn.addEventListener('click', () => {
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

        savedRecipes.push({
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory,
            instructions: meal.strInstructions,
            image: meal.strMealThumb,
            video: meal.strYoutube,
        });

        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));

        alert('Recipe saved successfully!');
    });
}


