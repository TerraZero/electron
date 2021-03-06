'use strict';

const Event = inc('./Event.class');

module.exports = class EventHandler {

  constructor(host, events = null) {
    host._events = this;
    host.events = function() {
      return this._events;
    };
    host.on = function(name, listener) {
      this.events().on(name, listener);
    };
    host.trigger = function() {
      return TOOLS.passOn(this.events(), this.events().trigger, arguments);
    };

    this._host = host;
    this._listeners = events && events.listeners() || {};
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

    let e = new Event(name, TOOLS.args(arguments, 1), this);

    for (let i in this._listeners[name]) {
      e.apply(this._listeners[name][i]);
    }
    return this.host();
  }

  listeners() {
    return this._listeners;
  }

}