'use strict'

const Island = require('../models/island');
const User =  require('../models/user');
const Category = require('../models/category');


const Poi = {
  explore: {
    handler: async function(request, h ) {
      const islands = await Island.find();
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      if (user.isAdmin == true) {
        console.log(user._id + ' - isAdmin: ' + user.isAdmin);
        return h.view('explore-admin', {
          title: 'Explore',
          islands: islands
        })
      } else if (user.isAdmin == false) {
        console.log(user._id + ' - isAdmin: ' + user.isAdmin);
        return h.view('explore-user', {
          title: 'Explore',
          islands: islands
        })
      }
    }
  },
  create: {
    handler: async function(request, h) {
      const user = await request.auth.credentials;
      if (user.isAdmin == true) {
        return h.view('createPOI-admin', {
          title: 'Add island',
        })
      } else if (user.isAdmin == false) {
        return h.view('createPOI-user', {
          title: 'Add island',
        })
      }
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
        addedBy: user.fName + ' ' + user.lName,
        modifiedBy: user.fName + ' ' + user.lName,
        longitude: data.longitude,
        latitude: data.latitude,
        createdDate: Date("<YYYY-mm-ddTHH:MM:ss>"),
        lastModifiedDate: Date("<YYYY-mm-ddTHH:MM:ss>")
      });
      await newPOI.save();
      const islands = await Island.find();
      if (user.isAdmin == true) {
        console.log(user._id + ' - isAdmin: '+ user.isAdmin);
        return h.view('explore-admin', {
          title: 'Explore',
          islands: islands
        })
      } else if (user.isAdmin == false) {
        console.log(user._id + ' - isAdmin: '+ user.isAdmin);
        return h.view('explore-user', {
          title: 'Explore',
          islands: islands
        })
      }
    }
  },
  manageDetails: {
    handler: async function(request, h) {
      const id = request.params.id;
      const island = await Island.findById(id);
      const cookieId = request.auth.credentials.id;
      const user = await User.findById(cookieId);
      if (user.isAdmin == true) {
        return h.view('details-admin', {
          title: island.name,
          island: island
        })
      } else if (user.isAdmin == false) {
        return h.view('details-user', {
          title: island.name,
          island: island
        })
      }
    }
  },
  showDetails: {
    auth: false,
    handler: async function(request, h) {
      const id = request.params.id;
      const island = await Island.findById(id);
      return h.view('details', {
        title: island.name,
        island: island
      })
    }
  },
  editIsland: {
    handler: async function(request, h ) {
      const id = request.params.id;
      const island = await Island.findById(id);
      const userId = request.auth.credentials.id;
      const user = await User.findById(userId);
      const categories =  await Category.find();
      if (user.isAdmin == true) {
        return h.view('editDetails-admin', {
          title: 'Edit'+island.name,
          island: island,
          categories: categories
        })
      } else if (user.isAdmin == false) {
        return h.view('editDetails-user', {
          title: 'Edit'+island.name,
          island: island,
          categories: categories
        })
      }
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
      island.modifiedBy = user.firstName + ' ' + user.lastName;
      island.lastModifiedDate = Date("<YYYY-mm-ddTHH:MM:ss>");
      await island.save();
      return h.redirect('/details/'+island.id)
    }
  },
  removeIsland: {
    handler: async function(request, h) {
      const island = await Island.findById(request.params.id);
      await Island.deleteOne(island);
      const islands = await Island.find();
      return h.redirect('/explore', {
        title: 'Explore',
        islands: islands
      });
    }
  }
};

module.exports = Poi;