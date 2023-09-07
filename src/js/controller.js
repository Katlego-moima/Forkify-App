import * as model from './model'
import { MODAL_CLOSE_SEC } from './config';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
// if (module.hot) {
// module.hot.accept();
// }

const controlRecipes = async () => {
  try {
    // Get the ID from the window location hash and assign it to the 'id' variable
    const id = window.location.hash.slice(1);

    // Guard clause: If 'id' is falsy (empty), return and exit the function
    if (!id) return;

    // Call the 'renderSpinner' method of the 'recipeView' object to display a loading spinner
    recipeView.renderSpinner();

    //0. update result view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1.loading the recipe
    // Use the 'loadRecipe' method from the 'model' module to load the recipe data
    await model.loadRecipe(id);

    // Call the 'render' method of the 'recipeView' object and pass in the 'recipe' property from the 'state' object
    recipeView.render(model.state.recipe);

    //updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

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
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

controlSearchResults();

const controlPagination = function (goToPage) {
  //Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render new pagination buttons
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  //Add or remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const constrolBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  //show loading spinner
  addRecipeView.renderSpinner();
  // console.log(newRecipe);
  try {
    //upload the new recipe data

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderSuccess();

    //render bookmarkview
    bookmarksView.render(model.state.bookmarks);

    //change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
};

// Define an initialization function called 'init'
const init = function () {
  // Call the 'addHandlerRender' method of the 'recipeView' object and pass in the 'controlRecipes' function as a callback
  // This sets up an event handler to render the recipe when triggered
  bookmarksView.addHandlerRender(constrolBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

// Call the 'init' function to initialize the application
init();

