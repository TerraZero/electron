'use strict';

// Invoke Sys and make it global
global.SYS = require('./core/boot/sys.class.js');
SYS._base = __dirname;

// Invoke Tools and make it global
global.TOOLS = require('./core/boot/tools.class.js');
global.SETGET = TOOLS.setGet;

global.log = function() {
  console.log.apply(console, TOOLS.args(arguments));
};
global.use = function() {
  return SYS.route.apply(SYS, TOOLS.args(arguments));
};
global.inc = function() {
  return SYS.inc.apply(SYS, TOOLS.args(arguments));
};
global.err = function() {
  return SYS.err.apply(SYS, TOOLS.args(arguments));
};
global.isClass = function(object, struct, based = true, instance = true) {
  if (TOOLS.isString(struct)) struct = use(struct);
  return instance && TOOLS.is(object, struct) || based && TOOLS.isBased(object, struct);
};

SYS.initialize();
