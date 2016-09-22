'use strict';

module.exports = class Sys {

  static initialize() {
    this._infos = {};
    this._errors = {};

    this.initializeErrors();
    this.initializeAnnotations();
    this.initializeRoutes();
    this.initializeInfos();
    this.initializeLibs();
    this.initializeMods();
  }

  static initializeErrors() {
    const errors = SYS.lookup('error');

    for (var i in errors) {
      var parse = errors[i].parseSys();

      this._errors[parse.name] = {
        path: errors[i],
        struct: undefined,
      };
    }
  }

  static initializeAnnotations() {
    this._Annotation = require('./bases/Annotation.class.js');
    TOOLS.Annotation.initialize();
  }

  /**
    * Read info files from mods directory and save it
    */
  static initializeInfos() {
    var dirs = this.config('base:root');
    dirs.push('lib');
    var files = this.lookup('info', dirs);

    for (var index in files) {
      this._infos[index] = new (require(files[index].resolve()))();
      this._infos[index]._base = files[index].parse().dir;
    }
  }

  static initializeLibs() {
    var libs = SYS.info('libs');

    for (var lib in libs) {
      TOOLS.Route.addRoute('lib.' + libs[lib].name, {
        path: libs[lib].paths[SYS.config('base:mode')] || libs[lib].paths.def,
        description: libs[lib].description || null,
      });
    }
  }

  /**
    * Loading mods from mods directory
    */
  static initializeMods() {
    this._Mod = use('base.mod');
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

  static initializeRoutes() {
    TOOLS.Route.initialize();
  }

  static config(name) {
    var parts = name.split(':');
    var keys = [];

    if (parts.length == 2) {
      keys = parts[1].split('.');
    }

    var config = require(SYS.base() + '/settings/' + parts[0] + '.json');

    config = new TOOLS.Settings(config);

    for (var key in keys) {
      config = config.g(keys[key]);
    }

    return config.get();
  }

  static settings(name) {
    var config = require(SYS.base() + '/settings/' + name + '.json');
    return new TOOLS.Settings(config);
  }

  static lookup(type, dirs = null) {
    var dirs = dirs || this.config('base:root');

    var result = [];
    for (var dir in dirs) {
      result = TOOLS.Array.merge(result, TOOLS.Path.glob(dirs[dir], '**/*.' + type + '.js'));
    }
    return result;
  }

  static plugins(annotations, dirs = null) {
    if (!TOOLS.isArray(annotations)) annotations = [annotations];
    var dirs = dirs || this.config('base:root');

    var result = [];
    for (var dir in dirs) {
      var paths = TOOLS.Path.glob(dirs[dir], '**/plugins/**/*.js');

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
    * Invokes a class or object of a specific type
    */
  static use(path, type = '.js', flush = false) {
    path = TOOLS.path(path, 1);
    var file = path.resolve(type);

    if (flush) {
      delete require.cache[require.resolve(file)];
    }
    return require(file);
  }

  static node(name) {
    return require(name);
  }

  static error(deep, type, message) {
    var args = TOOLS.args(arguments, 2);

    var error = new (SYS.getError(type))();
    error.deep(deep);
    error.create.apply(error, args);
    return error;
  }

  static throw(type, message) {
    var args = TOOLS.args(arguments);

    args.unshift(1);
    throw SYS.error.apply(SYS, args);
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
    * Get the base path of project
    *
    * @return string - path to root of project
    */
  static base() {
    return this._base;
  }

  static route(route) {
    return TOOLS.Route.load(route, TOOLS.args(arguments, 1));
  }

  static get Annotation() {
    return this._Annotation;
  }

  static getError(type) {
    if (this._errors[type].struct === undefined) {
      this._errors[type].struct = SYS.use(this._errors[type].path);
    }
    return this._errors[type].struct;
  }

  static info(name) {
    var infos = [];
    var args = TOOLS.args(arguments, 1);

    for (var i in this._infos) {
      if (TOOLS.isFunction(this._infos[i][name])) {
        infos = TOOLS.Array.merge(infos, this._infos[i][name].apply(this._infos[i], args));
      }
    }
    return infos;
  }

}