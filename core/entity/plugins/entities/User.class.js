'use strict';

const Entity = use('base.entity');
const Field = use('base.fieldtype');

/**
  * @Entity("User")
  */
module.exports = class User extends Entity {

  static info() {
    return {
      table: 'user',
      fields: [
        new Field('Firstname', 'first', 'firstname'),
        new Field('Lastname', 'last', 'lastname'),
      ],
    };
  }

  computed(mode) {
    return {
      name: function fieldName() {
        return this.firstname + ' ' + this.lastname;
      },
    };
  }

}