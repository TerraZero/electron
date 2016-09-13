'use strict';

module.exports = class Sys {

  static initialize() {
    this._infos = {};

    this.initializeAnnotations();
    this.initializeRoutes();
    this.initializeInfos();
    this.initializeMods();
  }

  static initializeAnnotations() {
    this._Annotation = require('./bases/Annotation.class.js');
    TOOLS.Annotation.initialize();
  }

  /**
    * Read info files from mods directory and save it
    */
  static initializeInfos() {
    var files = this.lookup('info');

    for (var index in files) {
      this._infos[index] = new (require(files[index].resolve()))();
      this._infos[index]._base = files[index].parse().dir;
    }
  }

  /**
    * Loading mods from mods directory
    */
  static initializeMods() {
    this._Mod = SYS.route('base.mod');
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

  static error(message) {
    var Logger = SYS.route('logger');

    if (Logger === null) {
      console.error(message);
    } else {
      Logger.error(message);
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

}