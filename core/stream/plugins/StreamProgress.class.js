'use strict';

const Stream = use('stream');

/**
  * @SysRoute(
  *   value="stream.progress",
  *   description="StreamProgress class",
  *   init=false,
  *   getter=false
  * )
  */
module.exports = class StreamProgress extends Stream {

  getNext() {
    const pipe = super.getNext();
    if (!pipe.isSilent()) {
      log('Task: ' + pipe.task());
    }
    return pipe;
  }

  createPipe(func, context = null, first = false, data = null) {
    return {
      func: func,
      context: context,
      data: data,
      isSilent: function() {
        return this.data.silent;
      },
      task: function() {
        return this.data.task;
      },
    };
  }

  invokeStream(invoke, context, args) {
    const that = this;

    invoke.func.pipe(function streamPipe(stream) {
      that.next.apply(that, TOOLS.args(arguments, 1));
    }).data({silent: true});
    invoke.func.execute.apply(invoke.func, args);
    // set reply to undefined for await response from pipe
    return undefined;
  }

}