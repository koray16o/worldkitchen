const { Schema, model } = require('mongoose');

const regionSchema = new Schema({
  name: String,
  picture: String
});

const Region = model('Region', regionSchema);

module.exports = Region;
