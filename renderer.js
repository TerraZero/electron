global.sys = require('./sys.js');
sys.base = __dirname + '/';

var render = sys.module('render');
var $ = sys.src('js', 'jquery-2.2.4.min');

var item = {
  type: 'node',
  field: {
    title: 'Test',
    body: 'jhdjsahd sdfhsdfhsd fhsdfsf sd fsdf',
  },
};

$('#content').append(render.view(item, 'full'));