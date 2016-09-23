'use strict';

const VueElement = use('interface.vueelement');

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
module.exports = class Entity extends VueElement {

  static vue(id) {
    return new this({id: id, title: 'test'}).view();
  }

  static load(id) {
    return this.render('entity.' + this.type(), {
      vue: 'entity.' + this.type() + ':vue:' + id,
    });
  }

  static entity(value) {
    return use('entity.' + value);
  }

  static initRoute() {
    const infos = this.info();

    this._table = infos.table;
    this._fields = infos.fields;
    this._controller = infos.controller || 'entity.controller';
  }

  static info() {
    throw err('AbstractError', this, 'info');
  }

  static table() {
    return this._table;
  }

  static fields() {
    return this._fields;
  }

  static controller() {
    return use(this._controller);
  }

  static type() {
    return this.name.toLowerCase();
  }

  constructor(data = null) {
    super();
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

  computed() {
    return {};
  }

  view() {
    return {
      data: this.data(),
      computed: this.computed(),
    };
  }

  loadID() {
    return 'base.entity:load:' + this.type() + ':' + this.id;
  }

}