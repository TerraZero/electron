'use strict';

const Event = SYS.use('handler/Event');

module.exports = class Handler {

  constructor(host) {
    this._host = host;
    this._listeners = {};
  }

  on(name, listener) {
    if (!this._listeners[name]) this._listeners[name] = [];
    this._listeners[name].push(listener);
    return this.host();
  }

  host() {
    return this._host;
  }

  trigger(name) {
    if (!this._listeners[name]) return this.host();

    var e = new Event(name, SYS.args(arguments, 1), this);

    for (var i in this._listeners[name]) {
      e.apply(this._listeners[name][i]);
    }
    return this.host();
  }

}