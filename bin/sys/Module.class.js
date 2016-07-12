'use strict';

module.exports = class Module {

  static build() {
    if (!ISDEF(this._build)) {
      this._build = new this();
    }
    return this._build;
  }

}