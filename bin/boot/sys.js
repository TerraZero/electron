'use strict';

const Boot = require('./boot.js');
const Module = require('./../sys/Module.class.js');

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

    this._SysError = SYS.use('sys/SysError');

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
    *
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
    *
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

  /**
    * Create the path for invoke
    *
    * @param path - the path to invoke
    * @param type - the type of the object
    * @param file - if the invoke path will be a file
    * @param offset - the offset for caller
    * @param absolute - flag if the path is already absolute
    */
  static usePath(path, type = 'class', file = false, offset = 0, absolute = false) {
    if (path.startsWith('.')) {
      path = Boot.getCaller(2 + offset).dir + path.substring(1);
    } else if (!absolute) {
      path = this.base() + 'bin/' + path;
    }

    if (file) {
      if (type) {
        return path + '.' + type + '.js';
      } else {
        return path + '.js';
      }
    }
    return path;
  }

  /**
    * Invokes a class or object of a specific type
    *
    * @param path - the path to look up
    * @param type - the type of the object
    *         options - class (default)
    *                 - null
    *                 - module
    *                 - mod
    *                 - node (load the node module directly)
    *                 - remote (load the node module directly over remote)
    * @param absolute - flag if the path is already absolute
    */
  static use(path, type = 'class', absolute = false) {
    // if type is a node or remote package than load it directly
    if (type == 'node') {
      return require(path);
    }
    if (type == 'remote') {
      return remote.require(path);
    }

    // if path has a trailing slash then invoke the package
    if (path.endsWith('/')) return Sys.usePackage(path, type, absolute);

    var struct = require(Sys.usePath(path, type, true, 0, absolute));

    // if struct is an Module than call build function to create the module
    if (TOOLS.isBased(struct, Module)) {
      return struct.build.apply(struct, TOOLS.args(arguments, 3));
    }

    return struct;
  }

  /**
    * Creates an object for all objects of a type in the package
    *
    * @param path - the path to look
    * @param type - the type of files to filter
    * @param absolute - flag if the path is already absolute
    * @return a package of classes and objects
    */
  static usePackage(path, type = 'class', absolute = false) {
    var key = path;
    var cache = Sys.cache('package', key);
    // load package from cache if exists
    if (cache) return cache;

    var files = [];
    var pack = {};

    path = Sys.usePath(path, type, false, 1, absolute);

    // if type is set load only the filtered files
    if (type == null) {
      files = Boot.list(path, '.*\..*\.js', 1);
    } else {
      files = Boot.list(path, '.*\.' + type + '\.js', 1);
    }

    for (var index in files) {
      pack[Boot.name(files[index])] = Sys.use(Boot.path(files[index]), Boot.type(files[index]), true);
    }

    // cache loaded packages
    return Sys.cache('package', key, pack);
  }

  /**
    * Close the application complete.
    */
  static exit() {
    remote.require('electron').app.quit();
  }

  /**
    * Create an contextual error object
    * TODO comment - and syserror rework
    */
  static context(subject, method = null, message = null) {
    var context = {
      subject: null,
      object: null,
      type: null,
      method: method,
      message: message,
    };

    if (subject === true) {
      return new this._SysError(method);
    }

    if (subject && subject.constructor && subject.constructor.name && typeof subject != 'string') {
      context.object = subject;
    } else if (subject) {
      context.subject = subject;
    }
    return new this._SysError(context);
  }


  /**
    * Get the base path of project
    *
    * @return string - path to root of project
    */
  static base() {
    return this._base;
  }

  // boot: function() {
  //   const File = SYS.module('file');

  //   this._mods.files = File.listSync(this.base + 'mods', '.*\.mod\.js$');
  //   this.hook('boot');
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

  // read: function(type, name) {
  //   return fs.readFileSync(this.path(type, name));
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

  //   callback.apply(object, _args);
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

};