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

    for (let i in errors) {
      let parse = errors[i].parseSys();

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
    let dirs = this.config('base:root');
    dirs.push('lib');
    let files = this.lookup('info', dirs);

    for (let index in files) {
      this._infos[index] = new (require(files[index].resolve()))();
      this._infos[index]._base = files[index].parse().dir;
    }
  }

  static initializeLibs() {
    let libs = SYS.info('libs');

    for (let lib in libs) {
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
    let files = this.lookup('mod');

    for (let index in files) {
      let mod = require(files[index].resolve()).build();

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
    let parts = name.split(':');
    let keys = [];

    if (parts.length == 2) {
      keys = parts[1].split('.');
    }

    let config = require(SYS.base() + '/settings/' + parts[0] + '.json');

    config = new TOOLS.Settings(config);

    for (let key in keys) {
      config = config.g(keys[key]);
    }

    return config.get();
  }

  static settings(name) {
    let config = require(SYS.base() + '/settings/' + name + '.json');
    return new TOOLS.Settings(config);
  }

  static lookup(type, dirs = null) {
    let dirs = dirs || this.config('base:root');

    let result = [];
    for (let dir in dirs) {
      result = TOOLS.Array.merge(result, TOOLS.Path.glob(dirs[dir], '**/*.' + type + '.js'));
    }
    return result;
  }

  static plugins(annotations, dirs = null) {
    if (!TOOLS.isArray(annotations)) annotations = [annotations];
    let dirs = dirs || this.config('base:root');

    let result = [];
    for (let dir in dirs) {
      let paths = TOOLS.Path.glob(dirs[dir], '**/plugins/**/*.js');

      for (let path in paths) {
        let annot = new TOOLS.Annotation(paths[path]);

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
  static inc(path, type = '.js', flush = false) {
    path = TOOLS.path(path, 1);
    let file = path.resolve(type);

    if (flush) {
      delete require.cache[require.resolve(file)];
    }
    return require(file);
  }

  static node(name) {
    return require(name);
  }

  static error(deep, type, message) {
    let args = TOOLS.args(arguments, 2);

    let error = new (SYS.getError(type))();
    error.deep(deep);
    error.create.apply(error, args);
    return error;
  }

  static throw(type, message) {
    let args = TOOLS.args(arguments);

    args.unshift(1);
    throw SYS.error.apply(SYS, args);
  }

  static err(name) {
    return new (SYS.getError(name))(TOOLS.args(arguments, 1));
  }

  /**
    * Get a mod
    *
    * @param name - the name of the mod class
    * @return Mod - the mod type
    */
  static mod(name) {
    for (let mod in this._mods) {
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
      this._errors[type].struct = inc(this._errors[type].path);
    }
    return this._errors[type].struct;
  }

  static info(name) {
    let infos = [];
    let args = TOOLS.args(arguments, 1);

    for (let i in this._infos) {
      if (TOOLS.isFunction(this._infos[i][name])) {
        infos = TOOLS.Array.merge(infos, this._infos[i][name].apply(this._infos[i], args));
      }
    }
    return infos;
  }

}