'use strict';

const Accounts = require('./app/controllers/accounts');
const Poi = require('./app/controllers/poi');
const Categories = require('./app/controllers/categories');

module.exports = [
  { method: 'GET', path: '/', config: Accounts.index },
  { method: 'GET', path: '/home', config: Accounts.home },
  { method: 'GET', path: '/signup', config: Accounts.showSignup },
  { method: 'GET', path: '/login', config: Accounts.showLogin },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/signup', config: Accounts.signup },
  { method: 'POST', path: '/login', config: Accounts.login },
  { method: 'GET', path: '/settings', config: Accounts.settings },
  { method: 'POST', path: '/updateSettings', config: Accounts.updateSettings },
  { method: 'GET', path: '/deleteUser/{id}', config: Accounts.deleteUser },
  { method: 'GET', path: '/adminDashboard', config: Accounts.adminDashboard},
  { method: 'POST', path: '/saveAdminChanges', config: Accounts.saveAdminChanges },

  { method: 'GET', path: '/explore', config: Poi.explore },
  { method: 'GET', path: '/create', config: Poi.create },
  { method: 'POST', path: '/add', config: Poi.addPOI },
  { method: 'GET', path: '/details/{id}', config: Poi.manageDetails },
  { method: 'GET', path: '/showDetails/{id}', config: Poi.showDetails },
  { method: 'GET', path: '/editIsland/{id}', config: Poi.editIsland },
  { method: 'POST', path: '/saveChanges/{id}', config: Poi.saveChanges },
  { method: 'GET', path: '/removeIsland/{id}', config: Poi.removeIsland },

  { method: 'POST', path: '/addCategory', config: Categories.addCategory },
  { method: 'POST', path: '/editCategory/{id}', config: Categories.editCategory },

  {method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './public'
      }
    },
    options: {auth: false}
  }

];


