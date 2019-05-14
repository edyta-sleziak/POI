'use strict'

const Island = require('../models/island');
const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils.js');

const Poi = {
  find: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const islands = await Island.find();
      return islands;
    }
  },
  findOne: {
    auth: {
      strategy: 'jwt',
    },
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
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const islands = await Island.find({ addedBy: request.params.id });
      return islands;
    }
  },
  findByUserModified: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const islands = await Island.find({ modifiedBy: request.params.id });
      return islands;
    }
  },
  findByCategory: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const islands = await Island.find({ category: request.params.id });
      return islands;
    }
  },
  create: {
    auth: {
      strategy: 'jwt',
    },
    //auth: false,
    handler: async function(request, h) {
      const userId = utils.getUserIdFromRequest(request);
      const newPoi = new Island(request.payload);
      //newPoi.addedBy = await User.findById({ _id: userId });
      const island = await newPoi.save();
      if(island) {
        return h.response(island).code(201);
      }
      return Boom.badImplementation('Error creating island');
    }
  },
  deleteAll: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await Island.remove({});
      return {success: true};
    }
  },
  removeUserAdded: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await Island.deleteMany({ addedBy: request.params.id });
      return {success: true};
    }
  },
  removeUserModified: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await Island.deleteMany({ modifiedBy: request.params.id });
      return {success: true};
    }
  },
  removeFromCategory: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await Island.deleteMany({ category: request.params.category });
      return {success: true};
    }
  },
  deleteOne: {
    auth: {
      strategy: 'jwt',
    },
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