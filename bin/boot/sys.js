'use strict';

const Boot = require('./boot.js');

const Module = require('./../classes/sys/Module.class.js');
const Mod = require('./../classes/sys/Mod.class.js');
const SysError = require('./../classes/sys/SysError.class.js');
var Arrays = require('./arrays.js');
Arrays = new Arrays();

const fs = require('fs');
const remote = require('electron').remote;

module.exports = class Sys {

  static initialize() {
    this._mods = {
      files: null,
      instances: null,
      hooks: {},
    };
    this._vars = {};
    this._paths = {};
    this._struct = {};
  }

  boot: function() {
    const File = SYS.module('file');

    this._mods.files = File.listSync(this.base + 'mods', '.*\.mod\.js$');
    this.hook('boot');
  },

  struct: function(name) {
    if (this._struct[name]) return this._struct[name];
    this._struct[name] = this.use(name);
    return this._struct[name];
  },

  mods: function() {
    if (this._mods.instances) return this._mods.instances;

    this._mods.instances = [];
    for (var file in this._mods.files) {
      var mod = require(this._mods.files[file]);

      mod = new mod();
      this.context('SYS', 'mods', 'Mod "' + this._mods.files[file] + '" are not a Mod instance but has the "mod.js" extension!').checkTypes(mod, Mod);
      this._mods.instances.push(mod);
    }
    return this._mods.instances;
  },

  hook: function(hook) {
    if (!this._mods.hooks[hook]) {
      this.generateHook(hook);
    }
    var mods = this._mods.hooks[hook];
    var args = this.args(arguments, 1);
    var results = [];

    for (var mod in mods) {
      var result = mods[mod][hook].apply(mods[mod], args);

      if (result != undefined) {
        results.push(result);
      }
    }
    return results;
  },

  generateHook: function(hook) {
    var mods = this.mods();
    this._mods.hooks[hook] = [];

    for (var mod in mods) {
      if (mods[mod][hook] && typeof mods[mod][hook] == 'function') {
        this._mods.hooks[hook].push(mods[mod]);
      }
    }
  },

  exists: function(path) {
    try {
      return fs.statSync(path);
    } catch (e) {
      return false;
    }
  },

  node: function(name) {
    return require(name);
  },

  module: function(name) {
    var module = require(this.base + 'modules/' + name + '.js');

    if (!module._instance) {
      module._instance = new module();
    }

    return module._instance;
  },

  src: function(type, name) {
    return require(this.path(type, name));
  },

  path: function(type, name) {
    return this.base + 'src/' + type + '/' + name;
  },

  read: function(type, name) {
    return fs.readFileSync(this.path(type, name));
  },

  register: function(name, path) {
    this._paths[name] = path;
  },

  className: function(name) {
    for (var field in this._paths) {
      name = name.replace(field, this._paths[field]);
    }
    return name;
  },

  static usePath(path) {
    return path;
  }

  static use(path, type = null) {
    // if path has a trailing slash then invoke the package
    if (path.endsWith('/')) return Sys.usePackage(path, type);

    // create the search path
    path = this.base + 'bin/' + Sys.usePath(path) + '.' + type + '.js';

    var subject = require(path);

    // call initialize for static function on classes
    if (!subject.isInitialized && Sys.isFunction(subject.initialize)) {
      subject.initialize();
      subject.isInitialized = true;
    }

    return subject;
  }

  static usePackage(path, type = null) {
    // create the search path
    path = this.base + 'bin/' + Sys.usePath(path);
    var files = [];
    var package = {};

    if (type == null) {
      files = Boot.list(path, '.*\..*\.js', 1);
    } else {
      files = Boot.list(path, '.*\.' + type + '\.js', 1);
    }

    for (var index in files) {
      package[Boot.name(files[index])] = Sys.use(Boot.path(files[index]), Boot.type(files[index]));
    }
    return package;
  }

  remote: function(name) {
    return remote.require(name);
  },

  exit: function() {
    this.remote('electron').app.quit();
  },

  get: function(name) {
    return this._vars[name];
  },

  set: function(name, value) {
    this._vars[name] = value;
  },

  context: function(subject, method = null, message = null) {
    var context = {
      subject: null,
      object: null,
      type: null,
      method: method,
      message: message,
    };

    if (subject === true) {
      return new SysError(method);
    }

    if (subject && subject.constructor && subject.constructor.name && typeof subject != 'string') {
      context.object = subject;
    } else if (subject) {
      context.subject = subject;
    }
    return new SysError(context);
  },

  args: function(args, offset = 0) {
    var _args = [];

    for (var i = offset; i < args.length; i++) {
      _args.push(args[i]);
    }
    return _args;
  },

  arrayArgs: function(args, offset = 0) {
    var _args = [];

    for (var i = offset; i < args.length; i++) {
      if (this.isArray(args[i])) {
        Arrays.merge(_args, args[i]);
      } else {
        _args.push(args[i]);
      }
    }
    return _args;
  },

  passOn: function(object, callback = null, args = []) {
    if (!callback) return;

    var _args = [];

    if (this.isArray(args)) {
      _args = args;
    } else {
      for (var index in args) {
        _args.push(args[index]);
      }
    }

    callback.apply(object, _args);
  },

  isArray: function(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
  },

  static isFunction(object) {
    return typeof object == 'function';
  }

  is: function(object, struct) {
    return object instanceof struct;
  },

  isStream: function(object) {
    return object instanceof this.struct('stream/Stream');
  },

  mapping: function(order, objects, sorting) {
    var ordered = [];

    for (var index in order) {
      for (var o in objects) {
        if (sorting(order[index], objects[o], index, o)) {
          ordered.push(objects[o]);
          objects.splice(o, 1);
        }
      }
    }
    return ordered;
  },

  isDef: function(defined) {
    return defined !== undefined;
  },

  setget: function(object, variable, name) {
    if (ISDEF(variable)) {
      object[name] = variable;
      return object;
    } else {
      return object[name];
    }
  },

};
