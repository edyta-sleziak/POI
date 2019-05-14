const Poi = require('./app/api/poi');
const User = require('./app/api/user');
const Category = require('./app/api/category');

module.exports = [
  { method: 'GET', path: '/api/poi', config: Poi.find },
  { method: 'GET', path: '/api/poi/{id}', config: Poi.findOne },
  { method: 'GET', path: '/api/poi/{id}/userAdded', config: Poi.findByUserAdded },
  { method: 'GET', path: '/api/poi/{id}/category', config: Poi.findByCategory },
  { method: 'GET', path: '/api/poi/{id}/userModified', config: Poi.findByUserModified },
  { method: 'POST', path: '/api/poi', config: Poi.create },
  { method: 'DELETE', path: '/api/poi', config: Poi.deleteAll },
  { method: 'DELETE', path: '/api/poi/{id}', config: Poi.deleteOne },
  { method: 'DELETE', path: '/api/poi/{id}/userAdded', config: Poi.removeUserAdded },
  { method: 'DELETE', path: '/api/poi/{category}/category', config: Poi.removeFromCategory },
  { method: 'DELETE', path: '/api/poi/{id}/userModified', config: Poi.removeUserModified },

  { method: 'POST', path: '/api/user/authenticate', config: User.authenticate },
  { method: 'GET', path: '/api/user', config: User.find },
  { method: 'GET', path: '/api/user/{id}', config: User.findOne },
  { method: 'POST', path: '/api/user', config: User.create },
  { method: 'DELETE', path: '/api/user', config: User.deleteAll },
  { method: 'DELETE', path: '/api/user/{id}', config: User.deleteOne },

  { method: 'GET', path: '/api/category', config: Category.find },
  { method: 'GET', path: '/api/category/{id}', config: Category.findOne },
  { method: 'POST', path: '/api/category', config: Category.create },
  { method: 'DELETE', path: '/api/category', config: Category.deleteAll },
  { method: 'DELETE', path: '/api/category/{id}', config: Category.deleteOne },

]
