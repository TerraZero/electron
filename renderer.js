'use strict';

var render = sys.module('render');
var $ = sys.src('js', 'jquery-2.2.4.min.js');
var Node = sys.use('Node');

var item = new Node();

item.fields.title = 'Test';
item.fields.body = 'Test Body';

$('#content').append(item.view('full'));