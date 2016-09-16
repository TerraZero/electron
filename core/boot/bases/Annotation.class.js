'use strict';

const AnnotationBase = require('tzero-annotations').Annotation;

module.exports = class Annotation extends AnnotationBase {

  /**
   * The possible targets
   *
   * (Annotation.DEFINITION, Annotation.CONSTRUCTOR, Annotation.PROPERTY, Annotation.METHOD)
   *
   * @type {Array}
   */
  static get targets() { return [Annotation.DEFINITION, Annotation.CONSTRUCTOR, Annotation.PROPERTY, Annotation.METHOD] }

  /**
   * Constructor to add attributes
   * @type {Array}
   */
  constructor(data, filePath) {
    super(data, filePath);
    this._originalData = data;

    var definition = this.definition();
    for (var field in definition) {
      this[field] = (data[field] === undefined ? definition[field] : data[field]);
    }
    for (var field in data) {
      if (definition[field] === undefined) {
        delete this[field];
      }
    }
  }

  originalData() {
    return this._originalData;
  }

  /**
   * Optional initialization method that
   * can be used to transform data
   *
   * @param  {Object} data
   * @return {void}
   */
  init(data) {

  }

  definition() {
    return {
      value: null,
    };
  }

  _name() {
    return this.constructor.name;
  }

  /**
    * @Magic
    */
  __filterValue(annotation) {
    return annotation._name();
  }

};