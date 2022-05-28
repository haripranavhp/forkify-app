// Model - Manages "state", web API calls
import "regenerator-runtime/runtime";
import { API_URL } from "./config.js";
import { getJSON, sendJSON } from "./helpers.js";
import { RES_PER_PAGE, KEY } from "./config";

export const state = {
	recipe: {},
	search: {
		query: "",
		results: [],
		resultsPerPage: RES_PER_PAGE,
		page: 1,
	},
	bookmarks: [],
};
// export and import has live connection between them.
const createRecipeObject = function (data) {
	const { recipe } = data.data;
	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		...(recipe.key && { key: recipe.key }),
	};
};
export const loadRecipe = async function (id) {
	try {
		const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
		// console.log( data);
		state.recipe = createRecipeObject(data);

		if (state.bookmarks.some((b) => b.id === id))
			state.recipe.bookmarked = true;
		else state.recipe.bookmarked = false;

		// console.dir(state.recipe);
	} catch (error) {
		console.error(error.message + "💥💢💥💢");
		throw error;
	}
};

export const loadSearchResults = async function (query) {
	try {
		const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

		state.search.query = query;
		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
				...(rec.key && { key: rec.key }),
			};
		});
	} catch (err) {
		console.error(err.message + "💥💢💥💢");
		throw err;
	}
};

export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;

	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;
	return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach((ing) => {
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
	});

	state.recipe.servings = newServings;
};
const persistBookmark = function () {
	localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
	//Add bookmark
	state.bookmarks.push(recipe);

	//Mark current recipe as Bookmark
	if (recipe.id === state.recipe.id) {
		state.recipe.bookmarked = true;
	}
	persistBookmark();
};

export const deleteBookmark = function (id) {
	//Delete bookmark
	const index = state.bookmarks.findIndex((book) => book.id === id);
	state.bookmarks.splice(index, 1);

	//Mark current recipe as Not Bookmark
	if (id === state.recipe.id) {
		state.recipe.bookmarked = false;
	}
	persistBookmark();
};

const init = function () {
	const storage = localStorage.getItem("bookmarks");
	if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter(
				(entry) => entry[0].startsWith("ingredient-") && entry[1] !== ""
			)
			.map((ing) => {
				const ingArr = ing[1].split(",").map((el) => el.trim());
				if (ingArr.length !== 3)
					throw new Error(
						"Wrong ingredient format! Please use the correct format :)"
					);

				const [quantity, unit, description] = ingArr;
				return {
					quantity: quantity ? +quantity : null,
					unit,
					description,
				};
			});
		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			publisher: newRecipe.publisher,
			image_url: newRecipe.image,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients: ingredients,
		};

		const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

		state.recipe = createRecipeObject(data);
		addBookmark(state.recipe);
	} catch (err) {
		throw err;
	}
};

// Function used to Sort the recipe results
const getRecipeData = async function (id) {
	try {
		const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
		return data.data.recipe;

		// console.dir(state.recipe);
	} catch (error) {
		console.error(error.message + "💥💢💥💢");
		throw error;
	}
};
export const getTotalDataForIDs = async function (recipeIDs) {
	try {
		const recipePromiseArray = [];
		for (const id of recipeIDs) {
			recipePromiseArray.push(getRecipeData(id));
		}
		const totalRecipeData = await Promise.all(recipePromiseArray);

		const totalRecipeDataFormatted = [];

		for (const index in totalRecipeData) {
			totalRecipeDataFormatted.push({
				id: totalRecipeData[index].id,
				title: totalRecipeData[index].title,
				publisher: totalRecipeData[index].publisher,
				sourceUrl: totalRecipeData[index].source_url,
				image: totalRecipeData[index].image_url,
				servings: totalRecipeData[index].servings,
				cookingTime: totalRecipeData[index].cooking_time,
				ingredients: totalRecipeData[index].ingredients,
				...(totalRecipeData[index].key && {
					key: totalRecipeData[index].key,
				}),
			});
		}
		// console.log(totalRecipeData);
		return totalRecipeDataFormatted;
	} catch (error) {
		console.error(error.message + "💥💢💥💢");
		throw error;
	}
};

const clearBookmark = function () {
	localStorage.clear("bookmarks");
};
