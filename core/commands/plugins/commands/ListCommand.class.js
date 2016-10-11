'use strict';

const Command = use('base.command');

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
    let printAll = this.arg('a', false);
    let printMore = printAll || this.arg('m', false);
    let printDescription = printAll || this.arg('d', false);

    let routes = TOOLS.Array.filter(TOOLS.Route.routes, expression, function(route) {
      return route.route();
    });

    let rows = [];

    for (let i in routes) {
      let route = [routes[i].route()];

      if (printMore && routes[i].register()) {
        route.push('-> {DynRoute} ' + routes[i].register().value);

        if (routes[i].register().loader) {
          route.push('-> {Loader} ' + routes[i].register().loader);
        }
      }
      let row = [
        routes[i].name(),
        route,
      ];

      if (printDescription) {
        row.push(routes[i].description());
      }
      rows.push(row);
    }
    let head = ['TYPE', 'ROUTE'];

    if (printDescription) head.push('DESCRIPTION');

    this.table({head: head, rows: rows});
  }

}