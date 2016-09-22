'use strict';

/**
  * @Base("Module")
  */
module.exports = class Module {

  static build() {
    if (this._build === undefined) {
      this._build = new this();
    }
    return this._build;
  }

}