'use strict';

const Mod = SYS.use('bin/sys/Mod');

module.exports = class Test extends Mod {

  config(def) {
    def.hall = 'sdsd';
  }

};