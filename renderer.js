'use strict';

const User = SYS.use('entity/User');
const db = SYS.module('db');

db.createTable(User.controller());

db.createTable(User);