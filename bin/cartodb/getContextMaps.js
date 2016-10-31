#!/usr/bin/env node

var CartoDB = require('cartodb');
var config = require('./cartodb-config.json');

var namedMaps = new CartoDB.Maps.Named({
  user: config.user,
  api_key: config.api_key
});

var templates = require('./templates.json');

var numTemplates = templates.length;
var currentTemplateIndex = 0;
var finalJSON = [];

createTemplate();

function createTemplate() {
  var template = templates[currentTemplateIndex];

  namedMaps.update({
    template: template
  }).on('done', function() {
    instantiateTemplate(template, nextTemplate);
  }).error(function() {
    namedMaps.create({
      template: template
    }).on('done', function() {
      instantiateTemplate(template, nextTemplate);
    });
  });
}

function instantiateTemplate(template, callback) {
  var templateName = template.name;
  namedMaps.instantiate({
    template_id: templateName,
    auth_token: 'auth_token1',
  }).on('done', function(res) {
    callback(res, templateName);
  });
}

function nextTemplate(res, templateName) {
  finalJSON.push({
    name: templateName,
    layergroupid: res.layergroupid
  });
  currentTemplateIndex++;
  if (currentTemplateIndex === numTemplates) {
    console.log(finalJSON)
  } else {
    createTemplate()
  }
}
