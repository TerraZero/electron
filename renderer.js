'use strict';

var i = sys.module('interface');
var Node = sys.use('Node');
var $ = sys.get('jquery');

var n = new Node();

n.fields.title = 'Test';
n.fields.body = 'Body';

$('#main').click(function() {
  i.replace('#main', n.view('full'));
});