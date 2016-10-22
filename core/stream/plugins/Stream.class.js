'use strict';

/**
  * @SysRoute(
  *   value="stream",
  *   description="Stream class",
  *   init=false,
  *   getter=false
  * )
  */
module.exports = class Stream {

  static getContext(stream, pipe) {
    return pipe.context || stream.context();
  }

  constructor(context) {
    this._context = context;
    this._pipe = [];
    this._current = 0;
  }

  pipe(func, context = null, first = false, data = null) {
    if (TOOLS.isString(context)) context = use(context);

    if (first) {
      this._pipe.unshift(this.createPipe(func, context, first, data));
    } else {
      this._pipe.push(this.createPipe(func, context, first, data));
    }
    return this;
  }

  createPipe(func, context = null, first = false, data = null) {
    return {func: func, context: context, data: data};
  }

  next() {
    let args = TOOLS.args(arguments);
    while (!this.isFinished()) {
      const current = this.getNext();
      const context = Stream.getContext(this, current);
      let reply = null;

      if (TOOLS.isFunction(current.func)) {
        reply = this.invokeFunction(current, context, args);
      }

      if (TOOLS.isString(current.func)) {
        reply = this.invokeString(current, context, args);
      }

      if (TOOLS.is(current.func, Stream)) {
        reply = this.invokeStream(current, context, args);
      }

      args = this.replyToArgs(reply);
      if (args === undefined) {
        return this;
      }
    }
    this.close();
    return this;
  }

  getNext() {
    // increase counter to prevent recursion
    return this._pipe[this._current++];
  }

  getCurrent() {
    return this._pipe[this._current];
  }

  invokeStream(invoke, context, args) {
    const that = this;

    invoke.func.pipe(function streamPipe(stream) {
      that.next.apply(that, TOOLS.args(arguments, 1));
    });
    invoke.func.execute.apply(invoke.func, args);
    // set reply to undefined for await response from pipe
    return undefined;
  }

  invokeString(invoke, context, args) {
    if (TOOLS.isFunction(context[invoke.func])) {
      args.unshift(this);
      return context[invoke.func].apply(context, args);
    } else {
      throw err('StreamError', 'String "' + invoke + '" was found in stream pipe, but is not a function in context "' + context.constructor.name + '"');
    }
  }

  invokeFunction(invoke, context, args) {
    args.unshift(this);
    return invoke.func.apply(context, args);
  }

  replyToArgs(reply) {
    if (reply === undefined) {
      return undefined;
    } else if (TOOLS.isArray(reply)) {
      return reply;
    } else {
      return [reply];
    }
  }

  error(error) {
    if (error) {
      throw error;
    }
  }

  execute() {
    return this.next.apply(this, TOOLS.args(arguments));
  }

  executeArgs(args) {
    return this.next.apply(this, args);
  }

  close() {
    return this;
  }

  pipes() {
    return this._pipe;
  }

  context() {
    return this._context;
  }

  isFinished() {
    return this._current >= this._pipe.length;
  }

  reset() {
    this._current = 0;
    return this;
  }

  data(index, data = null) {
    let pipe = null;
    if (TOOLS.isInt(index)) {
      pipe = this._pipe[index];
    } else {
      pipe = this._pipe[this._pipe.length - 1];
      data = index;
    }
    pipe.data = data;
    return this;
  }

}