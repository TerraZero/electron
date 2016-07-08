'use strict';

const Boot = require('./boot.js');

const remote = require('electron').remote;



// const Module = require('./../classes/sys/Module.class.js');
// const Mod = require('./../classes/sys/Mod.class.js');
// const SysError = require('./../classes/sys/SysError.class.js');
// var Arrays = require('./arrays.js');
// Arrays = new Arrays();

// const fs = require('fs');

module.exports = class Sys {

  static initialize() {
    this._cache = {};

    // this._mods = {
    //   files: null,
    //   instances: null,
    //   hooks: {},
    // };
    // this._vars = {};
    // this._paths = {};
    // this._struct = {};
  }

  /**
    * Build a cache or get a cache build
    * @param name - the name of the cache
    * @param key - the name of the key in the cache
    * @param set - the value to set for the defined cache
    * @return the cache object or if set isset (not null) the value to set
    */
  static cache(name, key, set = null) {
    this._cache[name] = this._cache[name] || {};

    if (set == null) {
      return this._cache[name][key];
    } else {
      this._cache[name][key] = set;
      return set;
    }
  }

  /**
    * Clear the cache for a specific definition
    * @param name - the name of the cache
    * @param key - the key of the cache
    */
  static clear(name = null, key = null) {
    if (name == null) {
      this._cache = {};
    } else if (this._cache[name]) {
      if (key == null) {
        this._cache[name] = {};
      } else if (this._cache[name][key]) {
        delete this._cache[name][key];
      }
    }
  }

  static usePath(path, type = 'class', file = false) {
    if (file) {
      if (type) {
        return this.base + 'bin/' + path + '.' + type + '.js';
      } else {
        return this.base + 'bin/' + path + '.js';
      }
    } else {
      return this.base + 'bin/' + path;
    }
  }

  /**
    * Invokes a class or object of a specific type
    * @param path - the path to look up
    * @param type - the type of the object
    *         options - class (default)
    *                 - null
    *                 - module
    *                 - mod
    *                 - node (load the node module directly)
    *                 - remote (load the node module directly over remote)
    */
  static use(path, type = 'class') {
    // if type is a node or remote package than load it directly
    if (type == 'node') {
      return require(path);
    }
    if (type == 'remote') {
      return remote.require(path);
    }

    var absolute = false;
    // create the search path
    // if the path starts with a '.' than the path is relative to package
    if (path.startsWith('.')) {
      var caller = Boot.getCaller();

      path = caller + '/' + path.substring(1);
      absolute = true;
    }

    // if path has a trailing slash then invoke the package
    if (path.endsWith('/')) return Sys.usePackage(path, type, absolute);

    var subject = require(Sys.usePath(path, type, true));

    // call initialize for static function on classes
    if (!subject.isInitialized && Sys.isFunction(subject.initialize)) {
      subject.initialize();
      subject.isInitialized = true;
    }

    return subject;
  }

  /**
    * Creates an object for all objects of a type in the package
    * @param path - the path to look
    * @param type - the type of files to filter
    * @param absolute - if the path is already absolute or not
    * @return a package of classes and objects
    */
  static usePackage(path, type = null, absolute = false) {
    // create the search path
    if (!absolute) {
      path = Sys.usePath(path, type);
    }
    var cache = Sys.cache('package', path);
    // load package from cache if exists
    if (cache) return cache;

    var files = [];
    var pack = {};

    // if type is set load only the filtered files
    if (type == null) {
      files = Boot.list(path, '.*\..*\.js', 1);
    } else {
      files = Boot.list(path, '.*\.' + type + '\.js', 1);
    }

    for (var index in files) {
      pack[Boot.name(files[index])] = Sys.use(Boot.path(files[index]), Boot.type(files[index]));
    }

    // cache loaded packages
    return Sys.cache('package', path, pack);
  }





  // boot: function() {
  //   const File = SYS.module('file');

  //   this._mods.files = File.listSync(this.base + 'mods', '.*\.mod\.js$');
  //   this.hook('boot');
  // },

  // struct: function(name) {
  //   if (this._struct[name]) return this._struct[name];
  //   this._struct[name] = this.use(name);
  //   return this._struct[name];
  // },

  // mods: function() {
  //   if (this._mods.instances) return this._mods.instances;

  //   this._mods.instances = [];
  //   for (var file in this._mods.files) {
  //     var mod = require(this._mods.files[file]);

  //     mod = new mod();
  //     this.context('SYS', 'mods', 'Mod "' + this._mods.files[file] + '" are not a Mod instance but has the "mod.js" extension!').checkTypes(mod, Mod);
  //     this._mods.instances.push(mod);
  //   }
  //   return this._mods.instances;
  // },

  // hook: function(hook) {
  //   if (!this._mods.hooks[hook]) {
  //     this.generateHook(hook);
  //   }
  //   var mods = this._mods.hooks[hook];
  //   var args = this.args(arguments, 1);
  //   var results = [];

  //   for (var mod in mods) {
  //     var result = mods[mod][hook].apply(mods[mod], args);

  //     if (result != undefined) {
  //       results.push(result);
  //     }
  //   }
  //   return results;
  // },

  // generateHook: function(hook) {
  //   var mods = this.mods();
  //   this._mods.hooks[hook] = [];

  //   for (var mod in mods) {
  //     if (mods[mod][hook] && typeof mods[mod][hook] == 'function') {
  //       this._mods.hooks[hook].push(mods[mod]);
  //     }
  //   }
  // },

  // module: function(name) {
  //   var module = require(this.base + 'modules/' + name + '.js');

  //   if (!module._instance) {
  //     module._instance = new module();
  //   }

  //   return module._instance;
  // },

  // src: function(type, name) {
  //   return require(this.path(type, name));
  // },

  // path: function(type, name) {
  //   return this.base + 'src/' + type + '/' + name;
  // },

  // read: function(type, name) {
  //   return fs.readFileSync(this.path(type, name));
  // },

  // register: function(name, path) {
  //   this._paths[name] = path;
  // },

  // className: function(name) {
  //   for (var field in this._paths) {
  //     name = name.replace(field, this._paths[field]);
  //   }
  //   return name;
  // },

  // remote: function(name) {
  //   return remote.require(name);
  // },

  // exit: function() {
  //   this.remote('electron').app.quit();
  // },

  // get: function(name) {
  //   return this._vars[name];
  // },

  // set: function(name, value) {
  //   this._vars[name] = value;
  // },

  // context: function(subject, method = null, message = null) {
  //   var context = {
  //     subject: null,
  //     object: null,
  //     type: null,
  //     method: method,
  //     message: message,
  //   };

  //   if (subject === true) {
  //     return new SysError(method);
  //   }

  //   if (subject && subject.constructor && subject.constructor.name && typeof subject != 'string') {
  //     context.object = subject;
  //   } else if (subject) {
  //     context.subject = subject;
  //   }
  //   return new SysError(context);
  // },

  static args(args, offset = 0) {
    var _args = [];

    for (var i = offset; i < args.length; i++) {
      _args.push(args[i]);
    }
    return _args;
  }

  // args: function(args, offset = 0) {
  //   var _args = [];

  //   for (var i = offset; i < args.length; i++) {
  //     _args.push(args[i]);
  //   }
  //   return _args;
  // },

  // arrayArgs: function(args, offset = 0) {
  //   var _args = [];

  //   for (var i = offset; i < args.length; i++) {
  //     if (this.isArray(args[i])) {
  //       Arrays.merge(_args, args[i]);
  //     } else {
  //       _args.push(args[i]);
  //     }
  //   }
  //   return _args;
  // },

  // passOn: function(object, callback = null, args = []) {
  //   if (!callback) return;

  //   var _args = [];

  //   if (this.isArray(args)) {
  //     _args = args;
  //   } else {
  //     for (var index in args) {
  //       _args.push(args[index]);
  //     }
  //   }

  //   callback.apply(object, _args);
  // },

  // isArray: function(object) {
  //   return Object.prototype.toString.call(object) === '[object Array]';
  // },

  static isFunction(object) {
    return typeof object == 'function';
  }

  // is: function(object, struct) {
  //   return object instanceof struct;
  // },

  // isStream: function(object) {
  //   return object instanceof this.struct('stream/Stream');
  // },

  // mapping: function(order, objects, sorting) {
  //   var ordered = [];

  //   for (var index in order) {
  //     for (var o in objects) {
  //       if (sorting(order[index], objects[o], index, o)) {
  //         ordered.push(objects[o]);
  //         objects.splice(o, 1);
  //       }
  //     }
  //   }
  //   return ordered;
  // },

  // isDef: function(defined) {
  //   return defined !== undefined;
  // },

  // setget: function(object, variable, name) {
  //   if (ISDEF(variable)) {
  //     object[name] = variable;
  //     return object;
  //   } else {
  //     return object[name];
  //   }
  // },

};