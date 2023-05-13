const router = require('express').Router();
const Recipe = require('../models/Recipe.model');
const Region = require('../models/Region.model');
const fileUpload = require('../config/cloudinary');

router.get('/regions/africa', async (req, res) => {
  const recipesFromDB = await Recipe.find().populate('region');

  const africaRecipes = recipesFromDB.filter(recipe => {
    return recipe.region.name === 'Africa';
  });
  res.render('regions/africa', { recipes: africaRecipes });
});
router.get('/regions/asia', async (req, res) => {
  const recipesFromDB = await Recipe.find().populate('region');

  const asiaRecipes = recipesFromDB.filter(recipe => {
    return recipe.region.name === 'Asia';
  });
  res.render('regions/asia', { recipes: asiaRecipes });
});
router.get('/regions/europe', async (req, res) => {
  const recipesFromDB = await Recipe.find().populate('region');

  const europeRecipes = recipesFromDB.filter(recipe => {
    return recipe.region.name === 'Europe';
  });
  res.render('regions/europe', { recipes: europeRecipes });
});
router.get('/regions/northamerica', async (req, res) => {
  const recipesFromDB = await Recipe.find().populate('region');

  const northAmericaRecipes = recipesFromDB.filter(recipe => {
    return recipe.region.name === 'Northamerica';
  });
  res.render('regions/northamerica', { recipes: northAmericaRecipes });
});
router.get('/regions/southamerica', async (req, res) => {
  const recipesFromDB = await Recipe.find().populate('region');

  const southAmericaRecipes = recipesFromDB.filter(recipe => {
    return recipe.region.name === 'Southamerica';
  });
  res.render('regions/southamerica', { recipes: southAmericaRecipes });
});

module.exports = router;

/* // recipe update {
name: "dawdad",
region: ""
}  */
