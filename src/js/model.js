import { API_URL, RES_PER_PAGE } from "./config";
import { getJSON } from "./helpers";


// Create a state object with an empty "recipe" property
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
}

// Define an asynchronous function called "loadRecipe" that takes an "id" parameter
export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}${id}`)
            // console.log(res, data);
        
            const {recipe} = data.data;
        
            state.recipe = {
              id: recipe.id,
              title: recipe.title,
              publisher: recipe.publisher,
              sourceUrl: recipe.source_url,
              image:recipe.image_url,
              servings: recipe.servings,
              cookingTime: recipe.cooking_time,
              ingredients: recipe.ingredients
            }
            // console.log(state.recipe)
    } catch (error) {
        console.error(`${error} 😡`);
        throw error;
    }
}

export const loadSearchResults = async function(query) {
    try {

        state.search.query = query;

        const data = await getJSON(`${API_URL}/?search=${query}`);

            console.log(data)
            state.search.results = data.data.recipes.map(rec => {
                return {
                    id: rec.id,
                    title: rec.title,
                    publisher: rec.publisher,
                    sourceUrl: rec.source_url,
                    image:rec.image_url,
                }
            });
            state.search.page = 1;
            
    } catch (error) {
        // console.log(error);
        throw error;
    }
}


export const getSearchResultsPage = function(page = state.search.page) {

    // const pageNum = 0 
    state.search.page = page

    const start =  (page - 1) * state.search.resultsPerPage
    const end =  page * state.search.resultsPerPage

    //return part of the results
    return state.search.results.slice(start, end);

}

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        
    });
    state.recipe.servings = newServings;

    }

export const addBookmark = function (recipe) {
    //add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmark

    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
}