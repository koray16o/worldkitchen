const router = require('express').Router();
const Recipe = require('../models/Recipe.model');
const Region = require('../models/Region.model');
const fileUpload = require('../config/cloudinary');

//This is a middleware (more protection)
function requireLogin(req, res, next) {
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
  const region = await Region.find();
  res.render('recipes/recipe-create', { region });
});

//http://localhost/books/edit -> right
//http://localhost/book-edit -> wrong
//Get the view to edit the book
router.get('/recipes/:id/edit', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  const region = await Region.find();
  //Name of the edit(file of hbs)
  res.render('recipes/recipe-edit', { recipe, region });
});

//Get the view to view the book
router.get('/recipes/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.render('recipes/recipe-details', recipe);
});

router.post('/recipes/create', fileUpload.single('image'), async (req, res) => {
  let fileUrlOnCloudinary = '';
  if (req.file) {
    fileUrlOnCloudinary = req.file.path;
  }

  const regionDB = await Region.findById(region);

  const {
    title,
    country,
    ingredients,
    dificulty,
    preparationTime,
    description,
    region,
    serves
  } = req.body;
  await Recipe.create({
    title,
    country,
    ingredients,
    dificulty,
    preparationTime,
    imageUrl: fileUrlOnCloudinary,
    description,
    region,
    serves
  });
  res.redirect(`/regions/${regionDB.name}`);
});

router.post('/recipes/edit', async (req, res) => {
  const {
    title,
    country,
    ingredients,
    dificulty,
    preparationTime,
    description
  } = req.body;
  await Recipe.findByIdAndUpdate(req.query.id, {
    title,
    country,
    ingredients,
    dificulty,
    preparationTime,
    description
  });
  res.redirect(`/recipes/${req.query.id}`);
});

router.post('/recipes/delete/:id', async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.redirect('/recipes');
});

router.post('/comments/add/:id', requireLogin, async (req, res) => {
  const { user, comment } = req.body;
  await Recipe.findByIdAndUpdate(req.params.id, {
    $push: { reviews: { user, comment } }
  });
  res.redirect(`/recipes/${req.params.id}`);
});

module.exports = router;

//http:localhost:3000/books?id=2 req.query
//http:localhost:3000/books/2 req.params
//req.body you dont see it, its in the body
