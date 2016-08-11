'use strict';

const path = require('path');
const basicAuth = require('basic-auth-connect');

const indexPath = path.join(process.cwd(), 'index.html');

module.exports = function(app) {
  if (process.env.AUTH_USER && process.env.AUTH_PASSWORD) {
    app.use(basicAuth(process.env.AUTH_USER, process.env.AUTH_PASSWORD));
  }
  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
};
