'use strict';

const Command = SYS.route('base.command');

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
    *   },
    *   options={
    *     a: {type: "boolean", description: "Print all infos"},
    *     m: {type: "boolean", description: "Print more infos about route"},
    *     d: {type: "boolean", description: "Print with description"}
    *   }
    * )
    */
  routes(expression = null) {
    var printAll = this.arg('a', false);
    var printMore = printAll || this.arg('m', false);
    var printDescription = printAll || this.arg('d', false);

    var routes = TOOLS.Array.filter(TOOLS.Route.routes, expression, function(route) {
      return route.route();
    });

    var rows = [];

    for (var i in routes) {
      var route = [routes[i].route()];

      if (printMore && routes[i].register()) {
        route.push('-> {DynRoute} ' + routes[i].register().value);

        if (routes[i].register().loader) {
          route.push('-> {Loader} ' + routes[i].register().loader);
        }
      }
      var row = [
        routes[i].name(),
        route,
      ];

      if (printDescription) {
        row.push(routes[i].description());
      }
      rows.push(row);
    }
    var head = ['TYPE', 'ROUTE'];

    if (printDescription) head.push('DESCRIPTION');

    this.table({head: head, rows: rows});
  }

}