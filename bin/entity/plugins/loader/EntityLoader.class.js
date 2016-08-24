'use strict';

(function registerController() {
  var plugins = SYS.plugins('Controller', 'bin', 'mods');

  for (var i in plugins) {
    var id = plugins[i].annotation.getDefinitions('Controller')[0].id;
    var name = plugins[i].annotation.getDefinitions('Controller')[0].name;
    var description = plugins[i].annotation.getDefinitions('Controller')[0].description;

    SYS.addPlugin(id || 'entity.' + name + '.controller', {
      path: plugins[i].path,
      description: description || '<Loader> Entity controller for ' + name,
    });
  }
})();

(function registerEntity() {
  var plugins = SYS.plugins('Entity', 'bin', 'mods');

  for (var i in plugins) {
    var id = plugins[i].annotation.getDefinitions('Entity')[0].id;
    var name = plugins[i].annotation.getDefinitions('Entity')[0].name;
    var controller = plugins[i].annotation.getDefinitions('Entity')[0].controller;
    var description = plugins[i].annotation.getDefinitions('Entity')[0].description;

    controller = controller || 'entity.' + name + '.controller';

    SYS.addPlugin(id || 'entity.' + name, {
      path: plugins[i].path,
      params: [controller],
      description: description || '<Loader> Entity class for ' + name,
    });
  }
})();

/**
  * @ID(
  *   value="entity",
  *   register=true,
  *   description="Load entity component routes"
  * )
  */
module.exports = class EntityLoader {

  static controller(name) {
    return SYS.get('entity.' + name + '.controller');
  }

  static entity(name) {
    return SYS.get('entity.' + name);
  }

}