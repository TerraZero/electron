'use strict';

const DB = SYS.module('db');
const User = SYS.use('entity/User');

var u = new User();
u.field('name', 'TerraZero');
u.save();

// http://stackoverflow.com/questions/7891937/is-it-possible-to-implement-dynamic-getters-setters-in-javascript