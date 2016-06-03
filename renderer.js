'use strict';

const DB = SYS.module('db');
const User = SYS.use('entity/User');
const Entity = SYS.use('entity/Entity');

var u = new User();

u.name = 'TerraZero';

u.view('full');
console.log(u);
console.log(u.render('full'));
console.log(u.render('full'));
u.name = 'Hallo';
console.log(u.render('full'));