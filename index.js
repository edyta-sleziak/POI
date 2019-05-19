'use strict';
require('dotenv').config();
const Hapi = require('hapi');
const Bell = require('bell');
const AuthCookie = require('hapi-auth-cookie');
const cloudinary = require('cloudinary');
const utils = require('./app/api/utils.js');
const fs = require('fs');

const server = Hapi.server({
  port: process.env.PORT || 3443,
  routes: { cors: true },
  tls: {
    key: fs.readFileSync('private/islands.key'),
    cert: fs.readFileSync('private/islands.crt')
  }
  // port: process.env.PORT || 4000,
  // routes: { cors: true }
});

require('./app/models/db');

async function init() {
  //await server.register(require('hapi-auth-cookie'));
  await server.register(require('inert'));
  await server.register(require('vision'));
  await server.register([Bell, AuthCookie]);
  await server.register(require('hapi-auth-jwt2'));

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path:'./app/views',
    layoutPath: './app/views/layouts',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false
  });

  let authCookieOptions = {
    password: process.env.cookie_password, // String used to encrypt auth cookie (min 32 chars)
    cookie: process.env.cookie_name,   // Name of cookie to set
    isSecure: false,        // Should be 'true' in production software (requires HTTPS)
    ttl: 24 * 60 * 60 * 1000,
    redirectTo: '/'
  };
  server.auth.strategy('cookie-auth', 'cookie', authCookieOptions);

  server.auth.strategy('jwt', 'jwt', {
    key: 'secretpasswordnotrevealedtoanyone',
    validate: utils.validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('cookie-auth');

  let bellAuthOptions = {
    provider: 'foursquare',
    password: 'cookie-encryption-password-secure',
    clientId: process.env.foursquareClientId,
    clientSecret: process.env.foursquareClientSecret,
    isSecure: true
  };

  server.auth.strategy('islands-oauth','bell',bellAuthOptions);

  //
  // server.auth.strategy('standard', 'cookie', {
  //   password: process.env.cookie_password,
  //   cookie: process.env.cookie_name,
  //   isSecure: false,
  //   ttl: 24 * 60 * 60 * 1000,
  //   redirectTo: '/'
  // });
  //
  // server.auth.default({
  //   mode: 'required',
  //   strategy: 'standard',
  // });

  server.route(require('./routes'));
  server.route(require('./routesapi'));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);

  cloudinary.config({
    cloud_name: process.env.cloudinary_cloudname,
    api_key: process.env.cloudinary_apikey,
    api_secret: process.env.cloudinary_apisecret
  });
}

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();