'use strict';

global.sys = require('./sys.js');
sys.base = __dirname + '/';

var $ = sys.src('js', 'jquery-2.2.4.min.js');