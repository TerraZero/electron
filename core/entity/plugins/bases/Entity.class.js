'use strict';

/**
  * @Base("Entity")
  * @SysRoute(
  *   value="entity.<value>",
  *   register="Entity",
  *   keys=["value"],
  *   description="Entity class for '<value>' entities",
  *   loader="entity:entity(value)",
  *   dir="entities"
  * )
  */
module.exports = class Entity {

  static load(type, id, mode) {
    const E = Entity.entity(type);

    // Test
    var e = new E({id: id, title: 'test'});

    if (mode) {
      return e.view(mode);
    }
    return e;
  }

  static entity(value) {
    return SYS.route('entity.' + value);
  }

  static initRoute() {
    const infos = this.info();

    this._table = infos.table;
    this._fields = infos.fields;
    this._controller = infos.controller || 'entity.controller';
  }

  static info() {
    SYS.throw('AbstractError', 'method', 'info', 'Entity');
  }

  static table() {
    return this._table;
  }

  static fields() {
    return this._fields;
  }

  static controller() {
    return SYS.route(this._controller);
  }

  constructor(data = null) {
    this._data = {};
    this.controller().create(this);
    this.controller().init(this, data);
  }

  type() {
    return this.constructor.name.toLowerCase();
  }

  table() {
    return this.constructor.table();
  }

  fields() {
    return this.constructor.fields();
  }

  controller() {
    return this.constructor.controller();
  }

  data() {
    return this._data;
  }

  computed(mode) {
    return {};
  }

  view(mode) {
    return {
      data: this.data(),
      computed: this.computed(mode),
      mode: mode,
      field: function getField(name, fallback = '') {
        if (this.data[name] !== undefined) return this.data[name];
        if (typeof this.computed[name] === 'function') {
          return this.computed[name].apply(this.data);
        }
        return fallback;
      },
    };
  }

}