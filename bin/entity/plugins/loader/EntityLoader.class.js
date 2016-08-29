'use strict';

(function registerController() {
  var plugins = SYS.plugins('Controller', 'bin', 'mods');

  for (var i in plugins) {
    var annot = plugins[i].annotation.getDefinitions('Controller')[0];

    SYS.addPlugin(annot.id || 'entity.' + annot.name + '.controller', {
      path: plugins[i].path,
      description: annot.description || '[Loader]: Entity controller for ' + annot.name,
      annotation: annot,
    });
  }
})();

(function registerEntity() {
  var plugins = SYS.plugins('Entity', 'bin', 'mods');

  for (var i in plugins) {
    var annot = plugins[i].annotation.getDefinitions('Entity')[0];

    annot.controller = annot.controller || 'entity.' + annot.name + '.controller';

    SYS.addPlugin(annot.id || 'entity.' + annot.name, {
      path: plugins[i].path,
      params: [annot.controller],
      description: annot.description || '[Loader]: Entity class for ' + annot.name,
      annotation: annot,
    });
  }
})();

/**
  * @SysRoute(
  *   value="entity",
  *   register=true,
  *   description="Loader for entities"
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