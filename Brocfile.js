/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({

  sassOptions: {
    includePaths: [
      'bower_components/compass-mixins/lib'
    ]
  },

});
var bowerDir = app.bowerDirectory + '/';

app.import(bowerDir + 'modernizr/modernizr.js');

app.import(bowerDir + 'normalize.css/normalize.css', {
  prepend: true
});

app.import('vendor/jquery.easing.js');

module.exports = app.toTree();
