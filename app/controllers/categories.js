'use strict'

const Category = require('../models/category');
const User = require('../models/user');

const Categories = {
  addCategory: {
    handler: async function(request, h) {
      const payload = request.payload;
      const newCategory = new Category({
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
  },
  removeCategory: {
    handler: async function(request, h) {
      const category = await Category.findById(request.params.id);
      await Category.deleteOne(category);
      const categories = await Category.find();
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