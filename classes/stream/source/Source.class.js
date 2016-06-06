'use strict';

module.exports = class Source {

  start(stream) {
    SYS.context(this, 'start').abstract();
  }

  next() {
    SYS.context(this, 'next').abstract();
  }

  done() {
    SYS.context(this, 'done').abstract();
  }

}