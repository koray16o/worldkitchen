const router = require('express').Router();
const Recipe = require('../models/Recipe.model');
const Region = require('../models/Region.model');
const fileUpload = require('../config/cloudinary');

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

//Getting the books
router.get('/recipes', async (req, res) => {
  const recipesFromDB = await Recipe.find();
  res.render('recipes/recipe-list', { recipes: recipesFromDB });
});

router.get('/recipes/create', async (req, res) => {
  //Remember to add isAdmin when presenting project
  const region = await Region.find();
  res.render('recipes/recipe-create', { region });
});

//http://localhost/books/edit -> right
//http://localhost/book-edit -> wrong
//Get the view to edit the book
router.get('/recipes/:id/edit', async (req, res) => {
  //Remember to add isAdmin when presenting project
  const recipe = await Recipe.findById(req.params.id);
  const region = await Region.find();
  //Name of the edit(file of hbs)
  res.render('recipes/recipe-edit', { recipe, region });
});

router.post('/recipes/create', fileUpload.array('files'), async (req, res) => {
  console.log(req);
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

router.post('/recipes/delete/:id', async (req, res) => {
  //Remember to add isAdmin when presenting project
  await Recipe.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

router.post('/reviews/add/:id', async (req, res) => {
  //Remember to add isAuthenticated when presenting project
  const { user, comment } = req.body;
  console.log(req.body);
  await Recipe.findByIdAndUpdate(req.params.id, {
    $push: { reviews: { user, comment } }
  });
  res.redirect(`/recipes/${req.params.id}`);
});

/* router.get('/recipes/search', async (req, res) => {
  const recipes = await Recipe.find({
    title: req.body.search
  }); 
  res.render('recipes/search-button', { recipes });
}); */

/* router.post('/recipes/search', async (req, res) => {
  await Recipe.find({ title: req.body.title });
  res.redirect('/recipes/search');
}); */

/* router.get('/recipes/search', async (req, res) => {
  const searchQuery = req.query.search;
  const recipes = await Recipe.find({
    title: { $regex: searchQuery, $options: '_id' }
  });
  res.render('recipes/search-button', { recipes, searchQuery });
}); */

/* router.get('/recipes/search', async (req, res) => {
  const searchQuery = req.query.search;

  const recipes = await Recipe.find({
    title: { $regex: searchQuery, $options: 'i' }
  });

  res.render('recipes/search-button', { recipes, searchQuery });
});

module.exports = router; */

//http:localhost:3000/books?id=2 req.query
//http:localhost:3000/books/2 req.params
//req.body you dont see it, its in the body
