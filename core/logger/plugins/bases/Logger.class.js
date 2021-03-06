'use strict';

/**
  * @Base("Logger")
  */
module.exports = class Logger {

  static getRoute(sysroute) {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  error() {
    console.error('Not Implement');
  }

  warn() {
    console.error('Not Implement');
  }

  log() {
    console.error('Not Implement');
  }

  console() {
    console.error('Not Implement');
  }

  success() {
    console.error('Not Implement');
  }

}