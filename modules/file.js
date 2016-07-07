'use strict';

const Module = SYS.use('!Module');

const fs = SYS.node('fs');
const path = SYS.node('path');

const Strings = SYS.module('strings');

module.exports = class File extends Module {

  list(dir, callback, expression = null) {
    var that = this;

    this.walk(dir, function(err, results) {
      if (err) throw err;

      callback(dir, that.filter(results, expression));
    });
  }

  walk(dir, done) {
    var that = this;
    var results = [];

    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            that.walk(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
  }

  filter(results, expression = null) {
    return Strings.filter(results, expression);
  }

  listSync(dir, expression = null, recursive = null) {
    var results = [];

    this.walkSync(dir, results, recursive);
    return this.filter(results, expression);
  }

  walkSync(dir, results, recursive = null, deep = 0) {
    var list = fs.readdirSync(dir);

    for (var i in list) {
      var file = path.resolve(dir, list[i]);
      var stat = fs.statSync(file);

      if (stat && stat.isDirectory()) {
        if (recursive == null || recursive > deep) this.walkSync(file, results, recursive, deep + 1);
      } else {
        results.push(file);
      }
    }
  }

};