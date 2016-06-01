'use strict';

var fs = require('fs');

module.exports = {

  node: function(name) {
    return require(name);
  },

  module: function(name) {
    var module = require(this.base + 'modules/' + name + '.js');

    if (module.isInit) return module;

    if (module.init) module.init();

    module.isInit = true;
    return module;
  },

  src: function(type, name) {
    return require(this.path(type, name));
  },

  path: function(type, name) {
    return sys.base + 'src/' + type + '/' + name;
  },

  read: function(type, name) {
    return fs.readFileSync(this.path(type, name));
  },

  use: function(name) {
    return require(this.base + 'classes/' + name + '.class.js');
  },

};