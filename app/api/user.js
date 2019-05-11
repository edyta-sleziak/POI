'use strict';

const UserModel = require('../models/user');
const Boom = require('boom');

const User = {

  find: {
    auth: false,
    handler: async function(request, h) {
      const users = await UserModel.find();
      return users;
    }
  },
  findOne: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await UserModel.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound('No user with this id');
        }
        return user;
      } catch (err) {
        return Boom.notFound('No Candidate with this id');
      }
    }
  },
  create: {
    auth: false,
    handler: async function(request, h) {
      const newUser = new UserModel(request.payload);
      const user = await newUser.save();
      if(user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation('Error creating user');
    }
  },
  deleteAll: {
    auth: false,
    handler: async function(request, h) {
      await UserModel.remove({});
      return {success: true};
    }
  },
  deleteOne: {
    auth: false,
    handler: async function(request, h) {
      const user = await UserModel.deleteOne({ _id: request.params.id })
      if(user) {
        return { success: true }
      }
      return Boom.notFound('Id not found');
    }
  }
};

module.exports = User;