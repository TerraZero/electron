'use strict';

global.SYS = require('./modules/sys.js');
SYS.base = __dirname + '/';

SYS.set('jquery', SYS.src('js', 'jquery-2.2.4.min.js'));