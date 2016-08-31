'use strict';

const Command = SYS.get('base.command');

/**
  * @Command(
  *   alias=["list"]
  * )
  */
module.exports = class ListCommand extends Command {

  /**
    * @Command(
    *   params={
    *     expression: {type: "string", value: null}
    *   }
    * )
    */
  routes(expression = null) {
    var routes = TOOLS.Array.filter(SYS._loaded_plugins, expression, function(route) {
      return route.id;
    });

    var rows = [];

    for (var i in routes) {
      var route = [routes[i].route];

      if (routes[i].register) {
        route.push('-> {DynRoute} ' + routes[i].register.value);

        if (routes[i].register.loader) {
          route.push('-> {Loader} ' + routes[i].register.loader);
        }
      }

      rows.push([
        routes[i].annotation._name(),
        route,
        routes[i].description,
      ]);
    }
    this.table({head: ['TYPE', 'ROUTE', 'DESCRIPTION'], rows: rows});
  }

}