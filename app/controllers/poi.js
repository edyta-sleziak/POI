'use strict'

const Island = require('../models/island');
const User =  require('../models/user');
var cloudinary = require('cloudinary');


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
        addedBy: user.email,
        modifiedBy: user.email,
        category: data.category,
        longitude: data.longitude,
        latitude: data.latitude
      });
      await newPOI.save();
      return h.redirect('/home');
    }
  },
  showDetails: {
    auth: false,
    handler: async function(request, h) {
      const id = request.params.id;
      const island = await Island.findById(id);
      return h.view('details', {
        title: 'Details of ' + island.name,
        island: island
      });
    }
  },
  editIsland: {
    handler: async function(request, h ) {
      const id = request.params.id;
      const island = await Island.findById(id);
      return h.view('editDetails', {
        title: 'Edit'+island.name,
        island: island
      });
    }
  },
  saveChanges: {
    handler: async function(request, h) {
      const id = request.params.id;
      const island = await Island.findById(id);
      const newDetails = request.payload;
      island.name = newDetails.name;
      island.description = newDetails.description;
      island.longitude = newDetails.longitude;
      island.latitude = newDetails.latitude;
      island.category = newDetails.category;
      const userId = request.auth.credentials.id;
      const user = await User.findById(userId);
      island.modifiedBy = user.email;
      await island.save();
      return h.redirect('/details/'+island.id)
    }
  },
  removeIsland: {
    handler: async function(request, h) {
      //const id = request.params.id;
      const island = await Island.findById(request.params.id);
      await Island.deleteOne(island);
      const islands = await Island.find();
      return h.redirect('/home', {
        title: 'Home',
        islands: islands
      });
    }
  }
};

module.exports = Poi;