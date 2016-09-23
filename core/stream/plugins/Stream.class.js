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

  constructor(context) {
    this._context = context;
    this._pipe = [];
    this._args = {};
  }

  pipe(func, first = false) {
    if (first) {
      this._pipe.unshift(func);
    } else {
      this._pipe.push(func);
    }
    return this;
  }

  next() {
    var args = TOOLS.args(arguments);
    var current = this._pipe.shift();

    // stream is closed
    if (current === undefined) return this.close();

    if (TOOLS.isFunction(current)) {
      args.unshift(this);
      current.apply(this.context(), args);
      return this;
    }

    if (TOOLS.isString(current)) {
      if (TOOLS.isFunction(this.context()[current])) {
        args.unshift(this);
        this.context()[current].apply(this.context(), args);
        return this;
      } else {
        throw err('StreamError', 'String "' + current + '" was found in stream pipe, but is not a function in context "' + this.context().constructor.name + '"');
      }
    }

    if (TOOLS.is(current, Stream)) {
      const that = this;

      current.pipe(function streamPipe(stream) {
        that.next.apply(that, TOOLS.args(arguments, 1));
      });
      current.execute.apply(current, args);
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