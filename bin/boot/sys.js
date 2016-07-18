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

  /**
    * Read info files from mods directory ans save it
    */
  static initializeInfos() {
    var files = Boot.list(this.base() + '/mods', '.*\.info\.js');

    for (var index in files) {
      this._infos[index] = new (require(files[index]))(Boot);
      this._infos[index]._base = Boot.parse(files[index]).dir;
    }
  }

  /**
    * Load UseRoutines from system
    */
  static initializeRoutines() {
    var files = this.infoHook('routines');

    for (var index in files) {
      var routine = new (require(files[index]))(Boot, Module);
      this._routines[routine.type()] = routine;
    }
  }

  /**
    * Init errors
    */
  static initializeErrors() {
    this._SysError = SYS.use('bin/sys/SysError');
  }

  /**
    * Loading mods from mods directory
    */
  static initializeMods() {
    this._Mod = SYS.use('bin/sys/Mod');
    this._mods = [];

    // get all mod files in mods directory
    var files = Boot.list(this.base() + '/mods', '.*\.mod\.js');

    for (var index in files) {
      var mod = SYS.use(files[index], 'resolved', {type: 'mod'});

      if (TOOLS.is(mod, this._Mod)) {
        this._mods.push({
          mod: mod,
          file: files[index],
          name: mod.constructor.name,
        });
      } else {
        // TODO ERROR
      }
    }
  }

  /**
    * Executing a hook without caching
    *
    * @see Sys.cHook
    *
    * @param (string) hook  - the name (function name) of the hook
    * @param ...            - arguments for the hook
    * @return array - the results from hooks
    */
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

  /**
    * Executing a hook with caching and merge the result
    *
    * @see Sys.hook
    * @see Tools.merge
    *
    * @param (string) hook  - the name (function name) of the hook
    * @param ...            - arguments for the hook
    * @return array - the merged results of an hook
    */
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

  /**
    * Executing a info hook with caching from info files
    *
    * @see Sys.cHook
    *
    * @param (string) hook  - the name (function name) of the hook
    * @param ...            - arguments for the hook
    * @return array - the merged results of an hook
    */
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

  /**
    * Generate the hook array for the hook function
    *
    * @see Sys.hook
    *
    * @param hook - the hook name to generate
    */
  static generateHook(hook) {
    this._hooks[hook] = [];

    for (var mod in this._mods) {
      if (this._mods[mod].mod[hook] && typeof this._mods[mod].mod[hook] == 'function') {
        this._hooks[hook].push(this._mods[mod].mod);
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

  /**
    * Get the defined use routine for a givin type
    *
    * @param type - the type of the routine
    * @return UseRoutine - the use routine for the type
    */
  static getUseRoutine(type = 'class') {
    if (this._routines[type]) {
      return this._routines[type];
    } else {
      return this._routines[null];
    }
  }

  /**
    * Get a mod
    *
    * @param name - the name of the mod class
    * @return Mod - the mod type
    */
  static mod(name) {
    for (var mod in this._mods) {
      if (this._mods[mod].name == name) {
        return this._mods[mod].mod;
      }
    }
    return null;
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

};