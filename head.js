'use strict';

global.SYS = require('./bin/boot/sys.js');
SYS.base = __dirname + '/';

// SYS.register('!Module', 'sys/Module');
// SYS.register('!Mod', 'sys/Mod');

SYS.initialize();

// SYS.set('jquery', SYS.src('js', 'jquery-2.2.4.min.js'));

// global.ISDEF = SYS.isDef;
// global.SETGET = SYS.setget;