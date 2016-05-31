// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var pug = require('pug');
var mysql      = require('mysql');
var fs = require('fs');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'cducsu',
});

connection.connect();

connection.query('SELECT s.name AS name, s.weight FROM system AS s WHERE s.weight <> 0', function(err, rows, fields) {
  if (err) throw err;

  for (var index in rows) {
    console.log(rows[index].name, rows[index].weight);
  }
});

connection.end();

var vars = {name: 'hallo'};
vars.filename = 'test.pug';
var file = fs.readFileSync('test.pug').toString();
file = 'include functions.pug \n' + file;
var html = pug.render(file, vars);
document.write(html);