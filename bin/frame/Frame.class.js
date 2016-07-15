'use strict';

module.exports = class Frame {

  static resolve(path) {
    Frame.boot();
    LOG(path);
  }

  static boot() {
    if (ISDEF(this._booted)) return;
    this._booted = true;

    LOG('boot frame');
  }

}