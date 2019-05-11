'use strict';

const axios = require('axios');

class PoiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getIslands() {
    const response = await axios.get(this.baseUrl + '/api/poi');
    return response.data;
  }

  async getIsland(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/poi/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getIslandByAdded(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/poi/' + id + '/userAdded');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getIslandByModified(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/poi/' + id + '/userModified');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getIslandByCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/poi/' + id + '/category');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createIsland(newIsland) {
    const response = await axios.post(this.baseUrl + '/api/poi', newIsland);
    return response.data;
  }

  async deleteAllIslands() {
    const response = await axios.delete(this.baseUrl + '/api/poi');
    return response.data;
  }

  async deleteOneIsland(id) {
    const response = await axios.delete(this.baseUrl + '/api/poi/' + id);
    return response.data;
  }
  async getUsers() {
    const response = await axios.get(this.baseUrl + '/api/user');
    return response.data;
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/user/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllUsers() {
    const response = await axios.delete(this.baseUrl + '/api/user');
    return response.data;
  }

  async deleteOneUser(id) {
    const response = await axios.delete(this.baseUrl + '/api/user/' + id);
    return response.data;
  }

  async createUser(newUser) {
    const response = await axios.post(this.baseUrl + '/api/user', newUser);
    return response.data;
  }

  async deleteAllCategories() {
    const response = await axios.delete(this.baseUrl + '/api/category');
    return response.data;
  }

  async createCategory(newCategory) {
    const response = await axios.post(this.baseUrl + '/api/category', newCategory);
    return response.data;
  }

  async getCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/category/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneCategory(id) {
    const response = await axios.delete(this.baseUrl + '/api/category/' + id);
    return response.data;
  }

  async getCategories() {
    const response = await axios.get(this.baseUrl + '/api/category');
    return response.data;
  }

}

module.exports = PoiService;