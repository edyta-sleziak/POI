'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const island = new Schema({
  name: String,
  description: String,
  addedBy: String,
  modifiedBy: String,
  longitude: String,
  latitude: String,
  category: String,
  createdDate: String,
  lastModifiedDate: String
});

module.exports = Mongoose.model('island', island);