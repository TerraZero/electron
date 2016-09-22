'use strict';

const Entity = use('base.entity');
const Field = use('base.fieldtype');

/**
  * @Entity("Node")
  */
module.exports = class Node extends Entity {

  static info() {
    return {
      table: 'node',
      fields: [
        new Field('ID', 'id', 'id'),
        new Field('Title', 'title', 'title'),
      ],
    };
  }

  computed(mode) {
    return {
      test: function() {
        return this.id + this.title + this.id;
      }
    };
  }

}