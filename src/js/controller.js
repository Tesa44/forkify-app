'use strict';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // Pobiera z linku stronu hash z nr id przepisu
    if (!id) return;
    //Loading recipe
    await model.loadRecipe(id); //Funkcja asynchroniczna zwróci obietnicę, którą musimy obsłużyć.

    recipeView.renderSpinner();

    //Updaye results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //2 Rendering recipe
    recipeView.render(model.state.recipe);
    //3 Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1 Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2 Load search results
    await model.loadSearchResults(query);

    // Render results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render NEW initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  //Tutaj trzeba dać async bo uploadRecipe jest asynchroniczna
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe); //Trzeba dać await bo funkcja uploadRecipe jest asynchroniczna
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //Zmiana URL bez ponownego ładowania strony
    // window.history.back()

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow(); //Nie może być setTimeout(addRecipeView.toggleWindow,MODAL_CLOSE_SEC*1000)
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('!!!', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
// To do
// Display number of pages between the pagination buttons
// Ability to sort search results by duration or number of ingredients
// Perform ingredient validation in view, before submitting the form
// Improve recipe ingredient input: separate in multiple fields and allow more than 6 ingredients
// Shopping list feature: button on recipe to add ingredients to a list
// Weekly meal planning feature: assign recipes to the next 7 days and show on a weekly calender
// Get nutrition data on each ingredient from spoonacular API and calculate total calories of recipe
