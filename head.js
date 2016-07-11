'use strict';

// Invoke Sys and make it global
global.SYS = require('./bin/boot/sys.js');
SYS._base = __dirname + '/';

// Invoke Tools and make it global
global.TOOLS = require('./bin/boot/tools.js');
global.ISDEF = TOOLS.isDef;
global.SETGET = TOOLS.setGet;

// SYS.register('!Module', 'sys/Module');
// SYS.register('!Mod', 'sys/Mod');

SYS.initialize();

// SYS.set('jquery', SYS.src('js', 'jquery-2.2.4.min.js'));
