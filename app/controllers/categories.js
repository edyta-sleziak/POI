'use strict'

const Category = require('../models/category');
const User = require('../models/user');

const Categories = {
  addCategory: {
    handler: async function(request, h) {
      const payload = request.payload;
      const newCategory = new Category({
        catId: payload.catId,
        name: payload.name,
      });
      await newCategory.save();
      const categories = Category.find();
      const users = User.find();
      return h.redirect('/adminDashboard', {
        title: 'Admin Dashboard',
        users: users,
        categories: categories,
      });
    }
  },
  editCategory: {
    handler: async function(request, h) {
      const newDetails = request.payload;
      const id = request.params.id;
      const updatedCategory = await Category.findById(id);
      updatedCategory.catId = newDetails.catId;
      updatedCategory.name = newDetails.name;
      await updatedCategory.save();
      const categories = Category.find();
      const users = User.find();
      return h.redirect('/adminDashboard', {
        title: 'Admin Dashboard',
        users: users,
        categories: categories,
      });
    }
  }
}

module.exports = Categories;