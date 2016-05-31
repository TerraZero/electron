'use strict';

module.exports = {

  node: function(name) {
    return require(name);
  },

  module: function(name) {
    var module = require('./modules/' + name + '.js');

    if (module.isInit) return module;

    if (module.init) module.init();

    module.isInit = true;
    return module;
  },

  src: function(type, name) {
    return require('./src/' + type + '/' + name + '.js');
  },

  use: function(name) {
    return require('./classes/' + name + '.class.js');
  },

};