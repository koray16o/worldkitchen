const router = require('express').Router();
const Recipe = require('../models/Recipe.model');
const Region = require('../models/Region.model');
const fileUpload = require('../config/cloudinary');

router.get('/regions/africa', async (req, res) => {
  res.render('regions/africa');
});
router.get('/regions/asia', async (req, res) => {
  const recipesFromDB = await Recipe.find().populate('region');

  const asiaRecipes = recipesFromDB.filter(recipe => {
    return recipe.region.name === 'Asia';
  });
  res.render('regions/asia', { recipes: asiaRecipes });
});
router.get('/regions/europe', async (req, res) => {
  res.render('regions/europe');
});
router.get('/regions/northamerica', async (req, res) => {
  res.render('regions/northamerica');
});
router.get('/regions/southamerica', async (req, res) => {
  const recipesFromDB = await Recipe.find().populate('region');

  const southAmericaRecipes = recipesFromDB.filter(recipe => {
    return recipe.region.name === 'South America';
  });
  res.render('regions/southamerica', { recipes: southAmericaRecipes });
});

module.exports = router;

/* // recipe update {
name: "dawdad",
region: ""
}  */
