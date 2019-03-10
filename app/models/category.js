'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const category = new Schema({
  catId: String,
  name: String,
});

module.exports = Mongoose.model('category', category);