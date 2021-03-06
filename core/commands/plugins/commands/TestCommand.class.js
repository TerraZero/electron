'use strict';

const Command = use('base.command');

/**
  * @Command(
  *   alias=["test"]
  * )
  */
module.exports = class TestCommand extends Command {

  /**
    * @Command
    */
  entity() {
    const Node = use('entity.node');
    const User = use('entity.user');

    let n = new Node({user: 'TerraZero', title: 'Node Title'});
    let u = new User({firstname: 'Terra', lastname: 'Zero'});

    let ud = u.display('full');
    console.log(ud);
  }

  /**
    * @Command
    */
  builder() {
    let User = use('entity.user');
    let u = new User();
    u.on('test').on('cool');
  }

  /**
    * @Command
    */
  options() {
    use('logger').options('Test: ', ['option 1', 'option 2', 'option 3']);
  }

  /**
    * @Command
    */
  datatype() {
    let name = this.input('int', 'Name');
  }

   /**
    * @Command
    */
  glob() {
    let paths = TOOLS.Path.glob('core', '**/plugins/**/*.class.js');
    for (let path in paths) {
      this.out(paths[path].resolve());
    }
  }

  /**
    * @Command
    */
  file() {
    let file = new TOOLS.File(':boot');
    console.log(file.file(''));
    this.print(file.list());
  }

  print(files, deep = '--') {
    for (let i in files) {
      console.log(deep + ' ' + files[i].path().parse().base);
      if (files[i].isDir()) {
        this.print(files[i].list(), deep + '--');
      }
    }
  }

  /**
    * @Command
    */
  errorCommand() {
    try {
      let e = SYS.getError('BootError');
      e = new e();
      throw e;
    } catch (e1) {
      try {
        console.log('boot');
        console.log(e1);
        console.log('boot end');
      } catch (e2) {
        console.log('internal');
        console.log(e2);
        console.log('internal end');
      }
    }
  }

  /**
    * @Command
    */
  abstract() {
    const Entity = use('base.entity');
    console.log(Entity.type());
  }

  /**
    * @Command
    */
  database() {
    const Stream = use('stream');

    new Stream(this)
      .pipe(this.dbCon)
      .pipe(this.dbQuery)
      .pipe(this.dbExecute)
      .pipe(this.dbRows)
      .execute('default');
  }

  dbCon(stream, name) {
    stream.next(use('db').con(name));
  }

  dbQuery(stream, con) {
    stream.next(con, con.select().from('node', 'n').field('n.id').field('n.name'));
  }

  dbExecute(stream, con, query) {
    con.execute(query, function(err, rows) {
      stream.error(err);
      stream.next(rows);
    });
  }

  dbRows(stream, rows) {
    log(rows);
  }

  /**
    * @Command
    */
  test() {
    const RE = use('element.render');
    const Node = use('entity.node');

    new RE(Node);
  }

}