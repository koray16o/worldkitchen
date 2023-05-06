const { Schema, model } = require('mongoose');
const recipeSchema = new Schema(
  {
    title: String,
    country: String,
    ingredients: String,
    dificulty: Number,
    preparationTime: String,
    imageUrl: String,
    description: String
  },
  {
    timestamps: true
  }
);

const recipeModel = model('Recipe', recipeSchema);

module.exports = recipeModel;
