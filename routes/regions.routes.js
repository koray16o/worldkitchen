const router = require('express').Router();
const Recipe = require('../models/Recipe.model');
const Region = require('../models/Region.model');
const fileUpload = require('../config/cloudinary');

router.get('/regions/africa', async (req, res) => {
  res.render('regions/africa');
});
router.get('/regions/asia', async (req, res) => {
  res.render('regions/asia');
});
router.get('/regions/europe', async (req, res) => {
  res.render('regions/europe');
});
router.get('/regions/northamerica', async (req, res) => {
  res.render('regions/northamerica');
});
router.get('/regions/southamerica', async (req, res) => {
  res.render('regions/southamerica');
});

module.exports = router;
