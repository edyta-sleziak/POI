'use strict'

const Island = require('../models/island');
const User = require('../models/user');
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
  },
  findByUserAdded: {
    auth: false,
    handler: async function(request, h) {
      const islands = await Island.find({ addedBy: request.params.id });
      return islands;
    }
  },
  findByUserModified: {
    auth: false,
    handler: async function(request, h) {
      const islands = await Island.find({ modifiedBy: request.params.id });
      return islands;
    }
  },
  findByCategory: {
    auth: false,
    handler: async function(request, h) {
      const islands = await Island.find({ category: request.params.id });
      return islands;
    }
  },
  create: {
    auth: false,
    handler: async function(request, h) {
      const newPoi = new Island(request.payload);
      const island = await newPoi.save();
      if(island) {
        return h.response(island).code(201);
      }
      return Boom.badImplementation('Error creating island');
    }
  },
  deleteAll: {
    auth: false,
    handler: async function(request, h) {
      await Island.remove({});
      return {success: true};
    }
  },
  removeUserAdded: {
    auth: false,
    handler: async function(request, h) {
      await Island.remove({ addedBy: request.params.id });
      return {success: true};
    }
  },
  removeUserModified: {
    auth: false,
    handler: async function(request, h) {
      await Island.remove({ modifiedBy: request.params.id });
      return {success: true};
    }
  },
  removeFromCategory: {
    auth: false,
    handler: async function(request, h) {
      await Island.remove({ category: request.params.id });
      return {success: true};
    }
  },
  deleteOne: {
    auth: false,
    handler: async function(request, h) {
      const island = await Island.deleteOne({ _id: request.params.id })
      if(island) {
        return { success: true }
      }
      return Boom.notFound('Id not found');
    }
  }
};

module.exports = Poi;