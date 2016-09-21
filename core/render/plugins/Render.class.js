'use strict';

/**
  * @SysRoute(
  *   value="render",
  *   description="Renderer"
  * )
  */
module.exports = class Render {

  static render(template, data) {
    return Render.getTemplate(template)(data);
  }

  static getTemplate(template) {
    return SYS.use(':tpl/' + template);
  }

}