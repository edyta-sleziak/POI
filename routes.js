'use strict';

const Accounts = require('./app/controllers/accounts');
const Poi = require('./app/controllers/poi');

module.exports = [
  { method: 'GET', path: '/', config: Accounts.index },
  { method: 'GET', path: '/signup', config: Accounts.showSignup },
  { method: 'GET', path: '/login', config: Accounts.showLogin },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/signup', config: Accounts.signup },
  { method: 'POST', path: '/login', config: Accounts.login },

  { method: 'GET', path: '/home', config: Poi.home },
  { method: 'GET', path: '/create', config: Poi.create },
  { method: 'POST', path: '/add', config: Poi.addPOI },

  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './public'
      }
    },
    options: {auth: false}
  }

];


