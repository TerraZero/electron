'use strict';

const Entity = SYS.route('base.entity');
const Field = SYS.route('base.fieldtype');

/**
  * @Entity("Node")
  */
module.exports = class Node extends Entity {

  static info() {
    return {
      table: 'node',
      fields: [
        new Field('User', 'user', 'user'),
        new Field('Title', 'title', 'title'),
      ],
    };
  }

  computed(mode) {
    return {};
  }

}