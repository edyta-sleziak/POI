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

  async deleteAllIslandsAddedByUser(id) {
    const response = await axios.delete(this.baseUrl + '/api/poi/' + id + '/userAdded');
    return response.data;
  }

  async deleteAllIslandsModifiedByUser(id) {
    const response = await axios.delete(this.baseUrl + '/api/poi/' + id + '/userModified');
    return response.data;
  }

  async deleteIslandsOfCategory(category) {
    const response = await axios.delete(this.baseUrl + '/api/poi/' + category + '/category');
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

  async authenticate(newUser) {
    try {
      const response = await axios.post(this.baseUrl + '/api/user/authenticate', newUser);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async clearAuth(user) {
    axios.defaults.headers.common['Authorization'] = '';
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

  async deleteAllReviews() {
    const response = await axios.delete(this.baseUrl + '/api/review');
    return response.data;
  }

  async createReview(newReview) {
    const response = await axios.post(this.baseUrl + '/api/review', newReview);
    return response.data;
  }

  async getReview(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/review/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneReview(id) {
    const response = await axios.delete(this.baseUrl + '/api/review/' + id);
    return response.data;
  }

  async getReviews() {
    const response = await axios.get(this.baseUrl + '/api/review');
    return response.data;
  }

  async getReviewByIsland(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/review/' + id + '/island');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getReviewByUser(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/review/' + id + '/userAdded');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllRatings() {
    const response = await axios.delete(this.baseUrl + '/api/rating');
    return response.data;
  }

  async createRating(newRating) {
    const response = await axios.post(this.baseUrl + '/api/rating', newRating);
    return response.data;
  }

  async getRatings() {
    const response = await axios.get(this.baseUrl + '/api/rating');
    return response.data;
  }

  async getRatingByIsland(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/rating/' + id + '/island');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getRatingByUser(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/rating/' + id + '/userAdded');
      return response.data;
    } catch (e) {
      return null;
    }
  }

}

module.exports = PoiService;