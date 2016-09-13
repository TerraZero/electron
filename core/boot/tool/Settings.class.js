'use strict';

module.exports = class Settings {

  constructor(settings) {
    this._settings = settings;
  }

  is(name) {
    return this._settings[name] !== undefined;
  }

  g(name) {
    return new Settings(this._settings[name]);
  }

  settings() {
    return this._settings;
  }

  get() {
    return this._settings;
  }

}