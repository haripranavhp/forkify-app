import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import sortResultsView from "./views/sortResultsView.js";

import { MODEL_CLOSE_SEC } from "./config.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// if (module.hot) {
// 	module.hot.accept();
// }

///////////////////////////////////////
console.log("Welcome...");
console.log("Welcome to Forkify App...");

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;

		recipeView.renderSpinner();
		// 0. Update results view to mark selected search result --> Known issue - commented for now.
		// resultsView.update(model.getSearchResultsPage());

		//render bookmarks
		bookmarksView.render(model.state.bookmarks);
		// 1. Loading recipe
		await model.loadRecipe(id);

		// 2. Rendering recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		//1) Get search query
		const query = searchView.getQuery();
		if (!query) return;

		resultsView.renderSpinner();

		//2) Load search query
		await model.loadSearchResults(query);

		//3) Render results
		resultsView.render(model.getSearchResultsPage(1));

		//4) Render pagination buttons
		paginationView.render(model.state.search);

		//5)Render Sort buttons
		sortResultsView.render(model.getSearchResultsPage(1));
	} catch (err) {
		console.log(err);
		resultsView.renderError(err.message);
	}
};

const controlPagination = function (goToPage) {
	//1) Render new results
	resultsView.render(model.getSearchResultsPage(goToPage));
	//2) Render new pagination buttons
	paginationView.render(model.state.search);
	//3)Render Sort buttons
	sortResultsView.render(model.getSearchResultsPage(goToPage));
};

const controlServings = function (newServings) {
	//update the recipe servings (in state)
	model.updateServings(newServings);
	//update the recipe view
	// recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	//1 Add or Remove Bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);
	//2 Update recipe => Bookmark
	recipeView.update(model.state.recipe);
	//3 Render Bookmarks
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		//Show loading spinner
		addRecipeView.renderSpinner();

		await model.uploadRecipe(newRecipe);
		console.log(model.state.recipe);

		//Render recipe
		recipeView.render(model.state.recipe);

		//success message
		addRecipeView.renderMessage();

		//Render Bookmark view
		bookmarksView.render(model.state.bookmarks);

		//Change ID in URL
		window.history.pushState(null, "", `#${model.state.recipe.id}`);

		//Close form model
		setTimeout(function () {
			addRecipeView.toggleWindow();
		}, MODEL_CLOSE_SEC * 1000);
	} catch (err) {
		console.error(err);
		addRecipeView.renderError(err.message);
	}
};

let flag = true;
const controlSortResults = async function (ids) {
	flag = !flag;
	if (flag) {
		resultsView.render(model.getSearchResultsPage(model.state.search.page));
		return;
	}
	//1) Render spinner on results view
	resultsView.renderSpinner();

	//2) Get Results data
	let totalData = await model.getTotalDataForIDs(ids);

	//3) Sort Results data by cooking time
	totalData.sort((a, b) => {
		return a.cookingTime - b.cookingTime;
	});
	//4) Render results
	resultsView.render(totalData);
};
const init = function () {
	//subscriber -> sending the function to execute as parameter to the publisher
	recipeView.addHandlerRender(controlRecipes);
	recipeView._addHandlerUpdateServings(controlServings);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addhandlerClick(controlPagination);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	addRecipeView.addHandlerUpload(controlAddRecipe);
	sortResultsView.addHandlerSort(controlSortResults);
};

init();
