'use strict';

module.exports = class Route {

  static initialize() {
    this.routes = [];

    var plugins = SYS.plugins('SysRoute');
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
            init: routes[r].init,
            getter: routes[r].getter,
          });
        }
      }
    }

    var plugins = SYS.plugins(pluginsRegister);
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
          init: regis.init,
          getter: regis.getter,
        });
      }
    }
  }

  static addRoute(route, data) {
    route = route.toLowerCase();
    if (this.routes[route] !== undefined) {
      throw err('RouteExistError', this.routes[route]);
    }

    data.route = route;
    this.routes[route] = new Route(data);
  }

  static setRoute(data) {
    if (data.route === undefined) throw err('RequiredFieldError', this, 'setRoute', 'data.route');
    var route = data.route.toLowerCase();

    if (this.routes[route] === undefined) {
      throw err('RouteNotExistError', route);
    }

    this.routes[route] = new Route(data);
  }

  static load(route, args) {
    const loadRoute = this.routes[route.toLowerCase()];

    if (loadRoute === undefined) throw err('RouteNotExistError', route);
    return loadRoute.getting(args);
  }

  constructor(data) {
    if (!data.route) {
      throw err('RequiredFieldError', this, 'constructor', 'data.route');
    }
    data.route = data.route.toLowerCase();
    if (!data.path) {
      throw err('RequiredFieldError', this, 'constructor', 'data.path');
    }

    this._route = data.route;
    this._description = data.description || '';
    this._path = data.path;
    this._params = data.params || [];
    this._struct = data.struct || undefined;
    this._annotation = data.annotation || null;
    this._register = data.register || null;
    this._init = (data.init === undefined ? 'initRoute' : data.init);
    this._getter = (data.getter === undefined ? 'getRoute' : data.getter);
  }

  route() {
    return this._route;
  }

  description() {
    return this._description;
  }

  path() {
    return this._path;
  }

  params() {
    return this._params;
  }

  struct() {
    return this._struct;
  }

  annotation() {
    return this._annotation;
  }

  name() {
    if (this._annotation) {
      return this._annotation._name();
    } else {
      return 'None';
    }
  }

  register() {
    return this._register;
  }

  init() {
    return this._init;
  }

  getter() {
    return this._getter;
  }

  /**
    * init route if a function is givin
    */
  initialize() {
    // add magic route informations
    this._struct.__route = this;

    if (this.init() && TOOLS.isFunction(this.struct()[this.init()])) {
      this.struct()[this.init()].call(this.struct(), this);
    }

    if (this.getter() && TOOLS.isFunction(this.struct()[this.getter()])) {
      this._getFunction = this.struct()[this.getter()];
    } else {
      this._getFunction = function(route) {
        return route.struct();
      };
    }
  }

  getting(args) {
    // if no struct is loaded, load the struct and initiat it
    if (this.struct() === undefined) {
      this._struct = inc(this.path());
      this.initialize();
    }

    args.unshift(this);
    return this._getFunction.apply(this.struct(), args);
  }

  /**
    * @Magic
    */
  __filterValue(route) {
    return route.route();
  }

}