const router = require('express').Router();
const Recipe = require('../models/Recipe.model');
const Region = require('../models/Region.model');
const fileUpload = require('../config/cloudinary');
const User = require('../models/User.model');

function isAdmin(req, res, next) {
  if (req.session.currentUser && req.session.currentUser.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      message: 'Forbidden'
    });
  }
}

function isAuthenticated(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/recipes', async (req, res) => {
  const recipesFromDB = await Recipe.find();
  res.render('recipes/recipe-list', { recipes: recipesFromDB });
});

router.get('/recipes/create', isAdmin, async (req, res) => {
  //Remember to add isAdmin when presenting project
  const region = await Region.find();
  res.render('recipes/recipe-create', { region });
});

router.get('/recipes/favourite', async (req, res) => {
  const userId = req.session.currentUser._id;
  const user = await User.findById(userId).populate('favouriteRecipes');

  res.render('recipes/recipe-favourites', {
    favouriteRecipes: user.favouriteRecipes
  });
});

router.post('/recipe/:id/favourites', async (req, res) => {
  const userId = req.session.currentUser._id;
  const userToCheck = await User.findById(userId);

  if (userToCheck.favouriteRecipes.includes(req.params.id)) {
    res.redirect('/recipes/favourite');
    return;
  }
  const user = await User.findByIdAndUpdate(userId, {
    $push: { favouriteRecipes: req.params.id }
  });
  //Update usser and push the recipe id to favoriteRecipes
  res.redirect('/recipes/favourite');
});

router.get('/recipes/:id/edit', isAdmin, async (req, res) => {
  //Remember to add isAdmin when presenting project
  const recipe = await Recipe.findById(req.params.id);
  const region = await Region.find();
  res.render('recipes/recipe-edit', { recipe, region });
});

router.post('/recipes/create', fileUpload.array('files'), async (req, res) => {
  let fileUrlOnCloudinary = [];
  if (req.files) {
    fileUrlOnCloudinary = req.files.map(file => file.path);
  }

  console.log(fileUrlOnCloudinary);

  const regionDB = await Region.findById(req.body.region);

  const {
    title,
    country,
    ingredients,
    difficulty,
    preparationTime,
    description,
    region,
    serves
  } = req.body;

  const ingredientsArray = ingredients.split(',');

  await Recipe.create({
    title,
    country,
    ingredients: ingredientsArray,
    difficulty,
    preparationTime,
    imageUrl: fileUrlOnCloudinary,
    description,
    region,
    serves
  });
  res.redirect(`/regions/${regionDB.name}`);
});

router.post('/recipes/edit', fileUpload.array('files'), async (req, res) => {
  console.log(req);
  let fileUrlOnCloudinary = [];
  if (req.files) {
    fileUrlOnCloudinary = req.files.map(file => file.path);
  }

  const {
    title,
    country,
    ingredients,
    difficulty,
    preparationTime,
    description
  } = req.body;
  const ingredientsArray = ingredients.split(',');

  await Recipe.findByIdAndUpdate(req.query.id, {
    title,
    country,
    ingredients: ingredientsArray,
    difficulty,
    preparationTime,
    description,
    imageUrl: fileUrlOnCloudinary
  });
  res.redirect(`/recipes/${req.query.id}`);
});
router.get('/recipes/:id', async (req, res) => {
  const recipes = await Recipe.findById(req.params.id).populate('region');
  console.log('Recipes: ', recipes);
  res.render('recipes/recipe-details', recipes);
});

router.post('/recipes/delete/:id', isAdmin, async (req, res) => {
  //Remember to add isAdmin when presenting project
  await Recipe.findByIdAndDelete(req.params.id);
  res.redirect('/');
});
router.post('/recipes/favourite/delete/:id', async (req, res) => {
  //CHECK HOW TO DELETE A RECIPE FROM FAVOURITES LIST WITHOUT DELETING IT FROM THE REGION LIST
  const userId = req.session.currentUser._id;
  await User.findByIdAndUpdate(userId, {
    $pull: { favouriteRecipes: req.params.id }
  });
  res.redirect('/recipes/favourite');
});

router.post('/reviews/add/:id', isAuthenticated, async (req, res) => {
  //Remember to add isAuthenticated when presenting project
  const { user, comment } = req.body;
  console.log(req.body);
  await Recipe.findByIdAndUpdate(req.params.id, {
    $push: { reviews: { user, comment } }
  });
  res.redirect(`/recipes/${req.params.id}`);
});

router.post('/recipes/search', async (req, res) => {
  const searchQuery = req.body.search;
  console.log(req.query);
  console.log('________________________________________');
  const recipes = await Recipe.find().populate('region comment');

  const filteredRecipes = recipes.map(recipe => {
    if (recipe.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return recipe;
    } else {
      return;
    }
  });

  res.render('recipes/search-button', {
    recipes: filteredRecipes,
    searchQuery
  });
});

module.exports = router;
