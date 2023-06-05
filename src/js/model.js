import { API_URL } from "./config";
import { getJSON } from "./helpers";

// Create a state object with an empty "recipe" property
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
    },
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
            
            
    } catch (error) {
        // console.log(error);
        throw error;
    }
}