'use strict';

const Boot = require('./boot.js');
const Module = require('./../sys/Module.class.js');

const remote = require('electron').remote;



// const Module = require('./../classes/sys/Module.class.js');
// const Mod = require('./../classes/sys/Mod.class.js');
// const SysError = require('./../classes/sys/SysError.class.js');
// var Arrays = require('./arrays.js');
// Arrays = new Arrays();

// const fs = require('graceful-fs');

module.exports = class Sys {

  static initialize() {
    this.initializeCache();
    this.initializeRoutines();
    this.initializeErrors();
    this.initializeMods();
  }

  static initializeCache() {
    this._cache = {};
  }

  static initializeRoutines() {
    this._routines = {};

    var files = Boot.list(this.base() + '/bin/boot/routines');

    for (var index in files) {
      var routine = require(files[index])(Boot, Module);
      this._routines[routine.type()] = routine;
    }
  }

  static initializeErrors() {
    this._SysError = SYS.use('bin/sys/SysError');
  }

  static initializeMods() {
    this._Mod = SYS.use('bin/sys/Mod');
    this._mods = [];
    this._hooks = {};

    // get all mod files in mods directory
    var files = Boot.list(this.base() + '/mods', '.*\.mod\.js');

    for (var index in files) {
      var mod = SYS.use(files[index], 'resolved');

      if (TOOLS.isBased(mod, this._Mod)) {
        this._mods.push({
          mod: new mod(),
          file: files[index],
        });
      } else {
        // TODO ERROR
      }
    }
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
  static use(path, type = 'class', options = {}) {
    var cid = options.cid || path + '::' + type;
    var cache = Sys.cache('use', cid);

    if (cache) return cache;

    options.cid = cid;
    options.path = path;
    options.type = type;

    var routine = Sys.getUseRoutine(type);

    path = routine.usePath(path, options);

    if (routine.isPackage(path, options)) {
      return Sys.cache('use', cid, routine.usePackage(path, options));
    }

    var struct = require(routine.usePath(path, options));

    return Sys.cache('use', cid, routine.useInit(struct, options));
  }

  static getUseRoutine(type = 'class') {
    if (this._routines[type]) {
      return this._routines[type];
    } else {
      return this._routines[null];
    }
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

};