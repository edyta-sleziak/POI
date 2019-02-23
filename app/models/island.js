'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const poiSchema = new Schema({
  name: String,
  description: String,
  addedBy: String,
  lastModifiedBy: String,
  imageURL: String
});

module.exports = Mongoose.model('poi', poiSchema);