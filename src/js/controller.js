import * as model from './model'
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView'
import searchView from './views/searchView'
import resultsView from './views/resultsView'
import paginationView from './views/paginationView';

// if (module.hot) {
// module.hot.accept();  
// }

const controlRecipes = async () => {
  try {

    // Get the ID from the window location hash and assign it to the 'id' variable
    const id = window.location.hash.slice(1);
    // console.log(id);

    // Guard clause: If 'id' is falsy (empty), return and exit the function
    if (!id) return;

    // Call the 'renderSpinner' method of the 'recipeView' object to display a loading spinner
    recipeView.renderSpinner();

    //0. update result view to mark selected search result
    resultsView.render(model.getSearchResultsPage())

    //1.loading the recipe
    // Use the 'loadRecipe' method from the 'model' module to load the recipe data
    await model.loadRecipe(id)

    // Call the 'render' method of the 'recipeView' object and pass in the 'recipe' property from the 'state' object
    recipeView.render(model.state.recipe);

  } catch (error) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {

    //get search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    //Load search results
    await model.loadSearchResults(query);

    //Render search results
    resultsView.render(model.getSearchResultsPage());

    //render initial  pagination buttons
    paginationView.render(model.state.search)


  } catch (error) {
    console.error(error);
  }
}

controlSearchResults();


const controlPagination = function (goToPage) {
  //Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render new pagination buttons
  paginationView.render(model.state.search)

}

const controlAddBookmark = function () {
  console.log(model.state.recipe.bookmarked)

  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // model.addBookmark(model.state.recipe)

  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe)
}

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings)

  //Update the recipe view
  recipeView.update(model.state.recipe);
}

// Define an initialization function called 'init'
const init = function () {
  // Call the 'addHandlerRender' method of the 'recipeView' object and pass in the 'controlRecipes' function as a callback
  // This sets up an event handler to render the recipe when triggered
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
}

// Call the 'init' function to initialize the application
init();

