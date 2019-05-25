'use strict';

const UserModel = require('../models/user');
const Boom = require('boom');
const utils = require('../api/utils.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const User = {

  find: {
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
        const user = await UserModel.findById(request.params.id );
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
      newUser.password = await bcrypt.hash(request.payload.password, saltRounds);
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
      const user = await UserModel.findById(request.params.id);
      if(user) {
        await UserModel.deleteOne(user);
        return { success: true }
      } else {
        return Boom.notFound('Id not found');
      }
    }
  },
  editUser: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      try {
        let editedUser = await request.payload;
        const currentUserId = utils.getUserIdFromRequest(request);
        const currentUser = await UserModel.findById({ _id: currentUserId });
        if (currentUser) {
          if (currentUser.isAdmin || currentUser._id === editedUser._id) {
            const user = await UserModel.findById({ _id: editedUser._id });
            if (user) {
              user.firstName = editedUser.firstName;
              user.lastName = editedUser.lastName;
              if (editedUser.password != null) {
                user.password = await bcrypt.hash(editedUser.password, saltRounds);
              }
              user.isAdmin = editedUser.isAdmin;
              await user.save();
              return h.response(user).code(201);
            } else {
              return h.response(user).code(500);
            }
          } else {
            console.log("No permission");
            return h.response(user).code(401)
          }
        } else {
          console.log("Unable to find current user");
          return h.response(user).code(404)
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  getLoggedUserData: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const userId = utils.getUserIdFromRequest(request);
      const user = await UserModel.findById({ _id: userId });
      return user;
    }
  },
  authenticate: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await UserModel.findByEmail(request.payload.email);
        if (!user) {
          return Boom.notFound('Authentication failed. User not found');
        } else {
          if(!await user.comparePassword(request.payload.password)) {
            const message = 'Password mismatch';
            throw new Boom(message);
          } else {
            const token = utils.createToken(user);
            return h.response({ success: true, token: token }).code(201);
          }
        }
      } catch (err) {
        return Boom.notFound('internal db failure');
      }
    }
  },
};

module.exports = User;