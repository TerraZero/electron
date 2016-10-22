'use strict';

const Command = use('base.command');

/**
  * @Command(
  *   alias=["streamtest"]
  * )
  */
module.exports = class StreamTest extends Command {

  /**
    * @Command
    */
  all() {
    const Stream = use('stream');

    const t = new Stream(this)
      .pipe(this.funcSyncTwo)
      .pipe(this.funcAsyncTwo);

    const s = new Stream(this)
      .pipe(this.funcSync)
      .pipe(this.funcAsync)
      .pipe(this.funcSyncTwo)
      .pipe(t)
      .pipe(this.funcAsyncTwo);

    log('start');
    s.execute(1);
    log('after');
  }

  /**
    * @Command
    */
  sync() {
    log('start');

    const Stream = use('stream');

    const s = new Stream(this)
      .pipe(this.funcSync)
      .pipe(this.funcSyncTwo);
    s.execute(5);

    log('end');
  }

  /**
    * @Command
    */
  async() {
    log('start');

    const Stream = use('stream');

    const s = new Stream(this)
      .pipe(this.funcAsync)
      .pipe(this.funcAsyncTwo);
    s.execute(10);

    log('end');
  }

  /**
    * @Command
    */
  stream() {
    log('start');

    const Stream = use('stream');

    const t = new Stream(this)
      .pipe(this.funcSync)
      .pipe(this.funcAsync);

    const s = new Stream(this)
      .pipe(this.funcSync)
      .pipe(t)
      .pipe(this.funcSync)
      .execute(20);

    log('end');
  }

  /**
  * @Command
  */
  progress() {
    log('start');

    const Stream = use('stream.progress');

    const t = new Stream(this)
      .pipe(this.funcSync).data({task: 'Stream t, Task 1'})
      .pipe(this.funcAsyncTwo).data({task: 'Stream t, Task 2'});

    const s = new Stream(this)
      .pipe(this.funcSync).data({task: 'Task 1'})
      .pipe(t)
      .pipe(this.funcSync).data({task: 'Task 2'})
      .data(1, {task: 'Task 3'})
      .pipe(function(stream) {
        log(stream.isFinished());
      }).data({task: 'Static test function'})
      .execute(20);

    log('end', s.isFinished());
    log(s.reset().isFinished());
  }

  funcSync(stream, i) {
    log('funcSync ' + i++);
    return i;
  }

  funcSyncTwo(stream, i) {
    console.log('funcSyncTwo ' + i++);
    return [i];
  }

  funcAsync(stream, i) {
    log('funcAsync start ' + i);
    setTimeout(function() {
      log('funcAsync end ' + i++);
      stream.next(i);
    }, 500);
  }

  funcAsyncTwo(stream, i) {
    log('funcAsyncTwo start ' + i);
    setTimeout(function() {
      log('funcAsyncTwo end ' + i++);
      stream.next();
    }, 500);
  }

}