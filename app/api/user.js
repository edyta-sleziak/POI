'use strict';

const UserModel = require('../models/user');
const Boom = require('boom');
const utils = require('../api/utils.js');


const User = {

  find: {
    // auth: {
    //   strategy: 'jwt',
    // },
    auth:false,
    handler: async function(request, h) {
      const users = await UserModel.find();
      return users;
    }
  },
  findOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      try {
        const user = await UserModel.findById({ _id: request.params.id });
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
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await UserModel.remove({});
      return {success: true};
    }
  },
  deleteOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const user = await UserModel.deleteOne({ _id: request.params.id });
      if(user) {
        return { success: true }
      }
      return Boom.notFound('Id not found');
    }
  },
  authenticate: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await UserModel.findByEmail(request.payload.email);
        if (!user) {
          return Boom.notFound('Authentication failed. User not found');
        }
        const token = utils.createToken(user);
        return h.response({ success: true, token: token }).code(201);
      } catch (err) {
        return Boom.notFound('internal db failure');
      }
    }
  },
};

module.exports = User;