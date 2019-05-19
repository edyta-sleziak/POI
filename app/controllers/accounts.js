'use strict';

const Boom = require('boom');
const Joi = require('joi');
const User = require('../models/user');
const Category = require('../models/category');
const Island = require('../models/island');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Accounts = {
  index: {
    auth: false,
    handler: async function(request, h) {
      const islands = await Island.find();
      return h.view('main', {
        title: 'Islands',
        islands: islands
      })
    },
  },
  home: {
    handler: async function(request, h) {
      const islands = await Island.find();
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      if (user == null) {
        return h.view('main', {
          title: 'Islands',
          islands: islands
        })
      } else if (user.isAdmin == true) {
        console.log(user._id + ' - isAdmin: '+ user.isAdmin);
        return h.view('main-admin', {
          title: 'Islands',
          islands: islands
        })
      } else if (user.isAdmin == false) {
        console.log(user._id + ' - isAdmin: '+ user.isAdmin);
        return h.view('main-user', {
          title: 'Islands',
          islands: islands
        })
      }
    },
  },
  showSignup: {
    auth: false,
    handler: function(request, h) {
      return h.view('signup', { title: 'Sign up to explore islands' });
    }
  },
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h.view('signup', {
          title: 'Sign up error',
          errors: error.details
        })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = 'Email address is already registered';
          throw new Boom(message);
        }
        const hash = await bcrypt.hash(payload.password, saltRounds);
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: hash,
          isAdmin: false,
          signupDate: Date("<YYYY-mm-ddTHH:MM:ss>"),
          lastLoginDate: Date("<YYYY-mm-ddTHH:MM:ss>")
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect('/explore');
      } catch (err) {
        return h.view('signup', { errors: [{ message: err.message }] });
      }
    }
  },
  showLogin: {
    auth: false,
    handler: function(request, h) {
      return h.view('login', { title: 'Login to see more' });
    }
  },
  foursquareLogin: {
    auth: 'islands-oauth',
    handler: async function(request, h) {
      //const code = await request.payload.code;
      if (request.auth.isAuthenticated) {
        request.cookieAuth.set(request.auth.credentials);
        console.log('authenticated');
        return h.view('explore')
      } else {
        return h.view('login', { title: 'Login to see more' });
      }
    }
  },
  login: {
    auth: false,
    handler: async function(request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = 'Email address is not registered';
          throw new Boom(message);
        }
        if(!await user.comparePassword(password)) {
          const message = 'Password mismatch';
          throw new Boom(message);
        } else {
          request.cookieAuth.set({ id: user.id });
          user.lastLoginDate = Date("<YYYY-mm-ddTHH:MM:ss>");
          if (user.isAdmin == true) {
            console.log(user._id + ' - isAdmin: ' + user.isAdmin);
            return h.redirect('/adminDashboard')
          } else {
            console.log(user._id + ' - isAdmin: ' + user.isAdmin);
            return h.redirect('/explore')
          }
        }
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
        const message = 'Incorrect e-mail or password';
        throw new Boom(message);
      }
    }
  },
  logout: {
    handler: function(request, h) {
      request.cookieAuth.clear();
      return h.redirect('/');
    }
  },
  settings: {
    handler: async function(request, h) {
      const user = await User.findById(request.auth.credentials.id);
      return h.view('settings', {
        title: 'Account settings',
        user: user
      });
    }
  },
  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view('settings', {
            title: 'Settings error',
            errors: error.details
          }).takeover().code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const userEdit = request.payload;
        const hash = await bcrypt.hash(userEdit.password, saltRounds);
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        user.firstName = userEdit.firstName;
        user.lastName = userEdit.lastName;
        user.email = userEdit.email;
        user.password = hash;
        await user.save();
        return h.redirect('/settings');
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  },
  deleteAccount: {
    handler: async function(request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      await User.deleteOne(user);
      request.cookieAuth.clear();
      return h.redirect('/');
    }
  },
  adminDashboard: {
    handler: async function(request,h) {
      const users = await User.find();
      const islands = await Island.find();
      const categories = await Category.find();
      return h.view('adminDashboard', {
        title: 'Admin Dashboard',
        users: users,
        islands: islands,
        categories: categories,
      })
    }
  },
  deleteUser: {
    handler: async function(request, h) {
      const user = await User.findById(request.params.id);
      await User.deleteOne(user);
      const users = await User.find();
      return h.redirect('/adminDashboard', {
        title: 'Admin Dashboard',
        users: users
      });
    }
  },
  saveAdminChanges: {
    handler: async function(request, h) {
      const data = request.payload;
      const users = await User.find();
      users.forEach(
        function(usr) {
          console.log("isAdmin_" + usr._id + " - " + data["isAdmin_" + usr._id]);
          usr.isAdmin = data["isAdmin_" + usr._id];
          usr.save()
        }
      );
      return h.redirect('/adminDashboard', {
        title: 'Admin Dashboard',
        users: users
      });
    }
  }
};

module.exports = Accounts;
