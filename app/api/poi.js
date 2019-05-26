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
      const islands = await Island.find({ addedBy: request.params.addedBy });
      return islands;
    }
  },
  findByUserModified: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const islands = await Island.find({ modifiedBy: request.params.modifiedBy });
      return islands;
    }
  },
  findByCategory: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const islands = await Island.find({ category: request.params.category });
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
      newPoi.addedBy = userId;
      newPoi.modifiedBy = userId;
      newPoi.description = '';
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
      await Island.deleteMany({ addedBy: request.params.addedBy });
      return {success: true};
    }
  },
  removeUserModified: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await Island.deleteMany({ modifiedBy: request.params.modifiedBy });
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
      const island = await Island.findById({ _id: request.params.id });
      console.log(island);
      if(island) {
        await Island.deleteOne(island);
        return { success: true }
      } else {
        return Boom.notFound('Id not found');
      }
    }
  },
  editIsland: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      try {
        console.log('debug1');
        const island = await Island.findById({ _id: request.params.id });
        const newData = await request.payload;
        console.log(island._id);
        if (!island) {
          return Boom.notFound('No island with this id');
        }
        console.log('debug2');
        const userId = utils.getUserIdFromRequest(request);
        console.log(userId);
        const user = await User.findById({ _id: userId });
        const date = Date("<YYYY-mm-ddTHH:MM:ss>");
        console.log('debug4');
        island.name = newData.name;
        island.description = newData.description;
        island.category = newData.category;
        island.latitude = newData.latitude;
        island.longitude = newData.longitude;
        island.modifiedBy = user;
        island.lastModifiedDate = date;
        await island.save();
        return island;
      } catch (err) {
        return Boom.notFound('Error occurred');
      }
    }
  }
};

module.exports = Poi;