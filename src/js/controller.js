import recipeView from './views/recipeViews.js';
import * as model from './model.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeViews.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // Render the spinner
    recipeView.renderSpinner();

    //Update result view to mark selected search result
    resultsView.update(model.getResultPerPage());
    bookmarksView.update(model.state.bookmarks);

    // Loading the recipe
    await model.loadRecipe(id);

    //Render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //Render Spinner
    resultsView.renderSpinner();

    //Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Load search query
    await model.loadSearchRecipe(query);

    //Render search query
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getResultPerPage());
  } catch (error) {
    resultsView.renderError();
  }

  //Render pagination view
  paginationView.render(model.state.search);
};

const controlPagination = function (goToPage) {
  //Render New search query
  resultsView.render(model.getResultPerPage(goToPage));

  //Render New pagination view
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings in state
  model.updateServings(newServings);

  //update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //Update the recipview
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //Success message
    addRecipeView.renderMessage();

    //Render recipe
    recipeView.render(model.state.recipe);

    //Render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in Url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
