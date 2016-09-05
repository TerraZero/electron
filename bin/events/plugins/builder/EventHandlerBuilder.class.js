'use strict';

/**
  * @Builder("Event")
  */
module.exports = class EventHandlerBuilder {

  static handler(object) {
    object.on = function(type, func) {
      // TODO
      return this;
    };
  }

}