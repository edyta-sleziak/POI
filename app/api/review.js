'use strict';

const ReviewModel = require('../models/Review');
const Boom = require('boom');
const utils = require('./utils.js');

const Review = {

  find: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const Reviews = await ReviewModel.find();
      return Reviews;
    }
  },
  findOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      try {
        const Review = await ReviewModel.findOne({ _id: request.params.id });
        if (!Review) {
          return Boom.notFound('No review with this id');
        }
        return Review;
      } catch (err) {
        return Boom.notFound('No review with this id');
      }
    }
  },
  findByReviewer: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const reviews = await ReviewModel.find({ addedBy: request.params.id });
      return reviews;
    }
  },
  findByIsland: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const reviews = await ReviewModel.find({ island: request.params.id });
      console.log(reviews);
      return reviews;
    }
  },
  create: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const newReview = new ReviewModel(request.payload);
      const date = Date("<YYYY-mm-ddTHH:MM:ss>");
      newReview.reviewText = request.payload.reviewText;
      newReview.addedBy = utils.getUserIdFromRequest(request);
      newReview.dateAdded = date;
      newReview.island = request.payload.island;
      const Review = await newReview.save();
      if(Review) {
        return h.response(Review).code(201);
      }
      return Boom.badImplementation('Error creating review');
    }
  },
  deleteAll: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await ReviewModel.remove({});
      return {success: true};
    }
  },
  deleteOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const Review = await ReviewModel.deleteOne({ _id: request.params._id });
      if(Review) {
        return { success: true }
      }
      return Boom.notFound('Id not found');
    }
  }
};

module.exports = Review;