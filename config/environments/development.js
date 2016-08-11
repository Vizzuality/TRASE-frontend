'use strict';

const path = require('path');

const indexPath = path.join(process.cwd(), 'index.html');

module.exports = function(app) {

  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
};
