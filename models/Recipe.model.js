const { Schema, model } = require('mongoose');
const recipeSchema = new Schema(
  {
    title: String,
    country: String,
    ingredients: Array,
    dificulty: Number,
    preparationTime: String,
    imageUrl: String,
    description: String,
    serves: String,
    region: { type: Schema.Types.ObjectId, ref: 'Region' }
  },
  {
    timestamps: true
  }
);

const recipeModel = model('Recipe', recipeSchema);

module.exports = recipeModel;
