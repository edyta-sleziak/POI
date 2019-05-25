'use strict';

const RatingModel = require('../models/rating');
const Boom = require('boom');

const Rating = {

  find: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const Ratings = await RatingModel.find();
      return Ratings;
    }
  },
  findByUser: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const ratings = await RatingModel.find({ addedBy: request.params._id });
      return ratings;
    }
  },
  findByIsland: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const ratings = await RatingModel.find({ island: request.params._id });
      return ratings;
    }
  },

  create: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const newRating = new RatingModel(request.payload);
      const Rating = await newRating.save();
      if(Rating) {
        return h.response(Rating).code(201);
      }
      return Boom.badImplementation('Error rating island');
    }
  },
  deleteAll: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await RatingModel.remove({});
      return {success: true};
    }
  },
};

module.exports = Rating;