'use strict';

module.exports = class Sys {

  static initialize() {
    this._infos = {};
    this._cache = {};
    this._hooks = {};
    this._routines = {};
    this._settings = {};
    this._loaded_routes = {};

    this.initializeSettings();
    this.initializeRoutines();
    this.initializeAnnotations();
    this.initializeInfos();
    this.initializeErrors();
    this.initializeMods();
    this.initializePlugins();
  }

  static initializeAnnotations() {
    TOOLS.Annotation.initialize();
  }

  static initializeSettings() {
    this._settings = require(this.base() + '/settings/base.json');
  }

  /**
    * Read info files from mods directory ans save it
    */
  static initializeInfos() {
    var files = this.lookup('info');

    for (var index in files) {
      this._infos[index] = new (require(files[index].resolve()))();
      this._infos[index]._base = files[index].parse().dir;
    }
  }

  /**
    * Load UseRoutines from system
    */
  static initializeRoutines() {
    this._routines[null] = new (require('./routines/UseRoutine.routine.js'))();
    this._routines['mod'] = new (require('./routines/ModRoutine.routine.js'))();
    this._routines['node'] = new (require('./routines/NodeRoutine.routine.js'))();
    this._routines['class'] = new (require('./routines/ClassRoutine.routine.js'))();
    this._routines['base'] = new (require('./routines/BaseRoutine.routine.js'))();

    var paths = this.lookup('routine', ['mods']);

    for (var index in paths) {
      var routine = new (require(paths[index].resolve()));

      this._routines[index] = routine;
    }
  }

  /**
    * Init errors
    */
  static initializeErrors() {
    this._SysError = SYS.use('bin/sys/SysError.error');
  }

  /**
    * Loading mods from mods directory
    */
  static initializeMods() {
    this._Mod = SYS.use('Mod.base');
    this._mods = [];

    // get all mod files in mods directory
    var files = this.lookup('mod');

    for (var index in files) {
      var mod = require(files[index].resolve()).build();

      if (TOOLS.is(mod, this._Mod)) {
        this._mods.push({
          mod: mod,
          file: files[index].resolve(),
          name: mod.constructor.name,
        });
      } else {
        // TODO ERROR
      }
    }
  }

  static initializePlugins() {
    var plugins = this.plugins('SysRoute');
    var register = {};
    var pluginsRegister = [];

    for (var p in plugins) {
      var routes = plugins[p].annotation.getDefinitions('SysRoute');

      for (var r in routes) {
        if (routes[r].register) {
          register[routes[r].register] = routes[r];
          pluginsRegister.push(routes[r].register);
        } else {
          this.addRoute(routes[r].value, {
            path: plugins[p].path,
            description: routes[r].description,
            annotation: routes[r],
            initFunction: routes[r].initFunction,
            getFunction: routes[r].getFunction,
          });
        }
      }
    }

    var plugins = this.plugins(pluginsRegister);
    for (var p in plugins) {
      var annots = plugins[p].annotation.getDefinitions(pluginsRegister);

      for (var a in annots) {
        var regis = register[annots[a]._name()];
        var value = regis.value;
        var description = annots[a].description || regis.description;

        for (var k in regis.keys) {
          value = value.replace('<' + regis.keys[k] + '>', annots[a][regis.keys[k]]);
          description = description.replace('<' + regis.keys[k] + '>', annots[a][regis.keys[k]]);
        }
        this.addRoute(value, {
          path: plugins[p].path,
          description: description,
          annotation: annots[a],
          register: regis,
          initFunction: regis.initFunction,
          getFunction: regis.getFunction,
        });
      }
    }
  }

  static setting(name) {
    return this._settings[name];
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
    var array = TOOLS.Array.merge.apply(TOOLS.Array, results);

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
  static info(hook) {
    var cid = hook;
    var cache = this.cache('info', cid);

    if (cache) return cache;

    var args = TOOLS.args(arguments, 1);
    var results = [];

    for (var info in this._infos) {
      if (this._infos[info][hook] && typeof this._infos[info][hook] == 'function') {
        var result = this._infos[info][hook].apply(this._infos[info], args);

        results = TOOLS.Array.merge(results, result);
      }
    }
    return this.cache('info', cid, results);
  }

  static lookup(type, dirs = null) {
    var dirs = dirs || this.setting('root');

    var result = [];
    for (var dir in dirs) {
      result = TOOLS.Array.merge(result, TOOLS.Path.list(this.base() + '/' + dirs[dir], '.*\.' + type + '\.js$'));
    }
    return result;
  }

  static plugins(annotations, dirs = null) {
    if (!TOOLS.isArray(annotations)) annotations = [annotations];
    var dirs = dirs || this.setting('root');

    var result = [];
    for (var dir in dirs) {
      var paths = TOOLS.Path.list(this.base() + '/' + dirs[dir], '.*plugins.*\.js$');

      for (var path in paths) {
        var annot = new TOOLS.Annotation(paths[path]);

        if (annot.hasDefinition(annotations)) {
          result.push({
            path: paths[path],
            annotation: annot,
          });
        }
      }
    }
    return result;
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
  static use(path, args = []) {
    if (!TOOLS.is(path, TOOLS.Path)) path = new TOOLS.Path(path, 1);

    var cid = path.path();
    var cache = this.cache('use', cid);

    if (cache) return cache;

    var routine = this.getRoutine(path);
    return routine.use(path, args);
  }

  static error(message) {
    var Logger = SYS.route('logger');

    if (Logger === null) {
      console.error(message);
    } else {
      Logger.error(message);
    }
  }

  static createRoute(data, route = null) {
    if (!route && !data.route) {
      SYS.error('Create SysRoute: route is required!');
      return;
    }
    route = (route || data.route).toLowerCase();
    if (!data.path) {
      SYS.error('Create SysRoute: "' + route + '" path is required!');
      return;
    }

    return {
      route: route,
      description: data.description || '',
      path: data.path,
      params: data.params || [],
      struct: data.struct || undefined,
      annotation: data.annotation || null,
      register: data.register || null,
      initFunction: (data.initFunction === undefined ? 'initRoute' : data.initFunction),
      getFunction: (data.getFunction === undefined ? 'getFunction' : data.getFunction),
    };
  }

  static addRoute(route, data) {
    if (this._loaded_routes[route.toLowerCase()] !== undefined) {
      SYS.error('SysRoute "' + route + '" is already in use! Use setRoute to override SysRoute!');
      return;
    }

    this._loaded_routes[route.toLowerCase()] = this.createRoute(data, route);
  }

  static setRoute(data) {
    var route = data.route.toLowerCase();

    if (this._loaded_routes[route] === undefined) {
      SYS.error('SysRoute "' + route + '" don\'t exist! Use addRoute to add the SysRoute!');
      return;
    }

    this._loaded_routes[route] = this.createRoute(data);
  }

  /**
    * Get the defined use routine for a givin type
    *
    * @param (Path) path - the type of the routine
    * @return UseRoutine - the use routine for the type
    */
  static getRoutine(path) {
    for (var index in this._routines) {
      if (this._routines[index].isRoutine(path)) {
        return this._routines[index];
      }
    }
    return this._routines[null];
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
    // remote.require('electron').app.quit();
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

  static route(route) {
    route = this._loaded_routes[route.toLowerCase()];

    // give null when no route is known
    if (route === undefined) return null;

    // if no struct is loaded, load the struct and initiat it
    if (route.struct === undefined) {
      route.struct = SYS.use(route.path);

      // add magic route informations
      route.struct.__route = route;

      // init route if a function is givin
      if (route.initFunction && TOOLS.isFunction(route.struct[route.initFunction])) {
        route.struct[route.initFunction].call(route.struct, route);
      }
    }

    // if a getter function is known than use it
    if (route.getFunction && TOOLS.isFunction(route.struct[route.getFunction])) {
      var args = TOOLS.args(arguments, 1);

      args.unshift(route);
      return route.struct[route.getFunction].apply(route.struct, args);
    }

    return route.struct;
  }

}