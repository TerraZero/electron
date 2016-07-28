'use strict'
const Annotation = require('tzero-annotations').Annotation;

module.exports = class TestAnnotation extends Annotation {

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
    constructor(data, filePath){
      super(data, filePath);
    }

    /**
     * Optional initialization method that
     * can be used to transform data
     *
     * @param  {Object} data
     * @return {void}
     */
    init(data) {
      // this.value = data.value;
    }

    name() {
      return this.constructor.name;
    }

};