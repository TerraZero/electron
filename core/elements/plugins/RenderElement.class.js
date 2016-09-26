'use strict';

/**
  * @SysRoute(
  *   value="element.render",
  *   description="Element render class."
  * )
  */
module.exports = class RenderElement {

  constructor(element) {
    if (!isClass(element, 'interface.vueelement')) {
      throw err('ArgError', this, 'constructor', 1, 'VueElement');
    }

  }

}
