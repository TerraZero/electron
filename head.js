'use strict';

// Invoke Sys and make it global
global.SYS = require('./core/boot/sys.class.js');
SYS._base = __dirname;

// Invoke Tools and make it global
global.TOOLS = require('./core/boot/tools.class.js');
global.ISDEF = TOOLS.isDef;
global.SETGET = TOOLS.setGet;
global.LOG = TOOLS.log;

SYS.initialize();
