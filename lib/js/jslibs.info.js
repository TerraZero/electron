'use strict';

const Info = SYS.route('base.info');

module.exports = class JsLibInfo extends Info {

  libs() {
    var libs = [];

    libs.push({
      name: 'jquery',
      version: '3.1.0',
      description: 'jQuery library',
      paths: {
        def: this.path('./jquery-3.1.0.min'),
        prod: this.path('./jquery-3.1.0.min'),
        dev: this.path('./jquery-3.1.0'),
      },
    });

    libs.push({
      name: 'vue',
      version: '1.0.26',
      description: 'Vue library',
      paths: {
        def: this.path('./vue.min'),
        prod: this.path('./vue.min'),
        dev: this.path('./vue'),
      },
    });

    return libs;
  }

}