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
    this._args = {};
  }

  pipe(func, context = null, first = false) {
    if (TOOLS.isString(context)) context = use(context);

    if (first) {
      this._pipe.unshift({func: func, context: context});
    } else {
      this._pipe.push({func: func, context: context});
    }
    return this;
  }

  next() {
    var args = TOOLS.args(arguments);
    var current = this._pipe.shift();

    // stream is closed
    if (current === undefined) return this.close();

    const context = Stream.getContext(this, current);

    if (TOOLS.isFunction(current.func)) {
      args.unshift(this);
      current.func.apply(context, args);
      return this;
    }

    if (TOOLS.isString(current.func)) {
      if (TOOLS.isFunction(context[current.func])) {
        args.unshift(this);
        context[current.func].apply(context, args);
        return this;
      } else {
        throw err('StreamError', 'String "' + current + '" was found in stream pipe, but is not a function in context "' + context.constructor.name + '"');
      }
    }

    if (TOOLS.is(current.func, Stream)) {
      const that = this;

      current.func.pipe(function streamPipe(stream) {
        that.next.apply(that, TOOLS.args(arguments, 1));
      });
      current.func.execute.apply(current.func, args);
      return this;
    }

    throw err('StreamError', 'The type of pipe is neither string, function nor Stream! Left ' + this.pipes().length + ' pipe\'s in stream!');
    return this;
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

  args() {
    return this._args;
  }

  arg(name, fallback = null) {
    return this._args[name] || fallback;
  }

  setArg(name, value) {
    this._args[name] = value;
  }

}