'use strict';

const Boot = require('./boot.js');
const Module = require('./../sys/Module.class.js');

const remote = require('electron').remote;

module.exports = class Sys {

  static initialize() {
    this._infos = {};
    this._cache = {};
    this._hooks = {};
    this._routines = {};

    // load default routine for classes
    this._routines['class'] = new (require('./routines/ClassRoutine.class.js'))(Boot, Module);

    this.initializeInfos();
    this.initializeRoutines();
    this.initializeErrors();
    this.initializeMods();
  }

  static initializeInfos() {
    var files = Boot.list(this.base() + '/mods', '.*\.info\.js');

    for (var index in files) {
      this._infos[index] = new (require(files[index]))(Boot);
    }
  }

  static initializeRoutines() {
    var files = this.infoHook('routines');

    for (var index in files) {
      var routine = new (require(files[index]))(Boot, Module);
      this._routines[routine.type()] = routine;
    }
  }

  static initializeErrors() {
    this._SysError = SYS.use('bin/sys/SysError');
  }

  static initializeMods() {
    this._Mod = SYS.use('bin/sys/Mod');
    this._mods = [];

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

  static hook(hook) {
    if (!this._hooks[hook]) {
      this.generateHook(hook);
    }
    var args = TOOLS.args(arguments, 1);
    var results = [];

    for (var mod in this._hooks[hook]) {
      var result = this._hooks[hook][mod][hook].apply(this._hooks[hook][mod], args);

      if (result != undefined) {
        results.push(result);
      }
    }
    return results;
  }

  static cHook(hook) {
    var cid = hook;
    var cache = this.cache('hook', cid);

    if (cache) return cache;

    var results = this.hook.apply(this, TOOLS.args(arguments, 1));
    results.unshift([]);
    // merge all arrays from result
    var array = TOOLS.merge.apply(TOOLS, results);

    return this.cache('hook', cid, array);
  }

  static infoHook(hook) {
    var cid = hook;
    var cache = this.cache('info', cid);

    if (cache) return cache;

    var args = TOOLS.args(arguments, 1);
    var results = [];

    for (var info in this._infos) {
      if (this._infos[info][hook] && typeof this._infos[info][hook] == 'function') {
        var result = this._infos[info][hook].apply(this._infos[info], args);

        results = TOOLS.merge(results, result);
      }
    }
    return this.cache('info', cid, results);
  }

  static generateHook(hook) {
    this._hooks[hook] = [];

    for (var mod in this._mods) {
      if (mods[mod].mod[hook] && typeof mods[mod][hook] == 'function') {
        this._hooks[hook].push(mods[mod].mod);
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
    * @param path     - the path to look up
    * @param type     - the type of the object
    *         options - class (default)
    *                 - null
    *                 - module
    *                 - mod
    *                 - node (load the node module directly)
    *                 - remote (load the node module directly over remote)
    * @param options  - Object for the use routine
    * @param args...  - Arguments for Module classes
    */
  static use(path, type = 'class', options = {}) {
    var cid = options.cid || path + '::' + type;
    var cache = this.cache('use', cid);

    if (cache) return cache;

    var routine = this.getUseRoutine(type);

    options.cid = cid;
    routine.useOptions(path, type, options, TOOLS.args(arguments, 3));
    path = routine.usePath(path, options);
    if (routine.isPackage(path, options)) {
      return this.cache('use', cid, routine.usePackage(path, options));
    }

    return this.cache('use', cid, routine.useInit(require(path), options));
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

};