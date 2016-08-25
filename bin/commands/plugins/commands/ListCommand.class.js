'use strict';

const Command = SYS.use('Command.base');

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
      rows.push([
        routes[i].annotation._name(),
        routes[i].id,
        routes[i].description,
      ]);
    }
    this.table({head: ['TYPE', 'ROUTE', 'DESCRIPTION'], rows: rows});
  }

}