const Poi = require('./app/api/poi');

module.exports = [
  { method: 'GET', path: '/api/poi', config: Poi.find },
  { method: 'GET', path: '/api/poi/{id}', config: Poi.findOne}
]