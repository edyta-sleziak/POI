'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const review = new Schema({
  island: String,
  reviewText: String,
  addedBy: String,
  dateAdded: Date
  });

module.exports = Mongoose.model('Review', review);