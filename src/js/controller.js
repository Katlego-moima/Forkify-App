import * as model from './model'
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView'

// const recipeContainer = document.querySelector('.recipe');




const controlRecipes = async () => {
  try {

    const id = window.location.hash.slice(1);
    console.log(id);

    //guard clause
    if(!id) return;
    recipeView.renderSpinner();

   //1.loading the recipe
   //the recipe is loaded here and will store data in state object
    await model.loadRecipe(id)

    //2.rendering recipe
    //data passed into render method
    recipeView.render(model.state.recipe);
    
  } catch (error) {
    console.log(error)
  }
}

// ['HashChange','load'].forEach(ev => window.addEventListener(ev,controlRecipes))

//duplicate code
//controlRecipes is a handler function
window.addEventListener('hashchange', controlRecipes)
window.addEventListener('load', controlRecipes)
