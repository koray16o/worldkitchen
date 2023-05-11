const router = require('express').Router();
const Recipe = require('../models/Recipe.model');
const Region = require('../models/Region.model');
const fileUpload = require('../config/cloudinary');

router.get('/regions/africa', async (req, res) => {
  const recipesFromDB = await Recipe.find().populate('region');

  const africaRecipes = recipesFromDB.filter(recipe => {
    return recipe.region.name === 'Africa';
  });
  res.render('regions/africa', { recipe: africaRecipes });
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
  res.render('regions/europe', { recipe: europeRecipes });
});
router.get('/regions/northamerica', async (req, res) => {
  const recipesFromDB = await Recipe.find().populate('region');

  const northAmericaRecipes = recipesFromDB.filter(recipe => {
    return recipe.region.name === 'North America';
  });
  res.render('regions/northamerica', { recipe: northAmericaRecipes });
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
