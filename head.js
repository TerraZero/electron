'use strict';

global.sys = require('./modules/sys.js');
sys.base = __dirname + '/';

sys.set('jquery', sys.src('js', 'jquery-2.2.4.min.js'));