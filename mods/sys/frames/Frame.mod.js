'use strict';

const Mod = SYS.use('bin/sys/Mod');

module.exports = class FrameMod extends Mod {

  constructor() {
    super();
    this._frames = null;
  }

  init() {
    this._frames = SYS.infoHook('frames');
  }

  resolve(path) {
    for (var index in this._frames) {
      if (this._frames[index].path == path) {
        var frame = SYS.use(this._frames[index].file);

        return new frame();
      }
    }
    return null;
  }

};