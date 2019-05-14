'use strict';

const CategoryModel = require('../models/category');
const Boom = require('boom');

const Category = {

  find: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const Categories = await CategoryModel.find();
      return Categories;
    }
  },
  findOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      try {
        const Category = await CategoryModel.findOne({ _id: request.params.id });
        if (!Category) {
          return Boom.notFound('No Category with this id');
        }
        return Category;
      } catch (err) {
        return Boom.notFound('No Candidate with this id');
      }
    }
  },
  create: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const newCategory = new CategoryModel(request.payload);
      const Category = await newCategory.save();
      if(Category) {
        return h.response(Category).code(201);
      }
      return Boom.badImplementation('Error creating Category');
    }
  },
  deleteAll: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await CategoryModel.remove({});
      return {success: true};
    }
  },
  deleteOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const Category = await CategoryModel.deleteOne({ _id: request.params.id });
      if(Category) {
        return { success: true }
      }
      return Boom.notFound('Id not found');
    }
  }
};

module.exports = Category;