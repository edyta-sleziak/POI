'use strict'

const Island = require('../models/island');
const Boom = require('boom');
const Poi = {
  find: {
    auth: false,
    handler: async function(request, h) {
      const islands = await Island.find();
      return islands;
    }
  },
  findOne: {
    auth: false,
    handler: async function(request, h) {
      try {
        const island = await Island.findById({ _id: request.params.id });
        if (!island) {
          return Boom.notFound('No island with this id');
        }
        return island;
      } catch (err) {
        return Boom.notFound('No island with this id');
      }
    }
  }
};

module.exports = Poi;