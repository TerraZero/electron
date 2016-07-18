'use strict';

const Mod = SYS.use('bin/sys/Mod');

module.exports = class FrameMod extends Mod {

  init() {
    var frames = SYS.infoHook('frames');
  }

};