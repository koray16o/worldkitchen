const { Schema, model } = require('mongoose');

const regionSchema = new Schema({
  country: String,
  picture: String
});

const Region = model('Region', regionSchema);

module.exports = Region;
