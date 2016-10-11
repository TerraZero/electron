'use strict';

module.exports = class Event {

  constructor(trigger, args, handler) {
    this._trigger = trigger;
    this._args = args;
    this._consumed = false;
    this._apply = [this];
    this._hander = handler;

    for (let i in this._args) {
      this._apply.push(this._args[i]);
    }
  }

  handler() {
    return this._hander;
  }

  trigger() {
    return this._trigger;
  }

  consume() {
    this._consumed = true;
  }

  consumed() {
    this._consumed;
  }

  args() {
    return this._args;
  }

  apply(listener) {
    listener.apply(this.handler(), this._apply);
  }

}