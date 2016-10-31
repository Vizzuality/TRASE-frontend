#!/usr/bin/env node

var CartoDB = require('cartodb');
var config = require('./cartodb-config.json');

var namedMaps = new CartoDB.Maps.Named({
  user: config.user,
  api_key: config.api_key
});

var template = {
  "version": "0.0.1",
  "name": "indigenous_areas",
  "layergroup": {
    "version": "1.0.1",
    "layers": [
      {
        "type": "cartodb",
        "options": {
          "sql": "SELECT * FROM indigenous_areas",
          "cartocss": "#brazil_protected{ polygon-fill: #5CA2D1; polygon-opacity: 0.7; line-color: #FFF; line-width: 0.5; line-opacity: 1;}",
          "cartocss_version": "2.3.0",
          "interactivity":[ "cartodb_id", "situacao13", "populaa_a_8", "nome_are22", "grupos9", "datadoc16"]
        }
      }
    ]
  }
};

console.log(template)

namedMaps.instantiate({
  template_id: 'indigenous_areas',
  auth_token: 'auth_token1',

}).on('done', function(res) {
  console.log(res)
})

return;
namedMaps.create({
  template: template
}).on('done', function(res) {
  console.log(res);

}).error(function() {
  console.log(arguments)
});
