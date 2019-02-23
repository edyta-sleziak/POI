'use strict'

const Island = require('../models/island');
const User =  require('../models/user');

const Poi = {
  home: {
    handler: async function(request, h ) {
      const islands = await Island.find();
      return h.view('home', {
        title: 'Home',
        islands: islands
      });
    }
  },
  create: {
    handler: function(request, h) {
      return h.view('createPOI', {title: 'Add island'});
    }
  },
  addPOI: {
    handler: async function(request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const data = request.payload;
      const newPOI = new Island({
        name: data.name,
        description: data.description,
        addedBy: user.email
      });
      await newPOI.save();
      return h.redirect('/home');
    }
  }
};

module.exports = Poi;