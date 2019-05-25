'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const rating = new Schema({
  rating: Number,
  island: String,
  ratedBy: String,
});

module.exports = Mongoose.model('Rating', rating);