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

  constructor(context) {
    super(context);
    this._steps = null;
  }

  steps() {
    return this._steps;
  }

  step() {
    return this._steps - this.pipes().length;
  }

  execute() {
    this._steps = this.pipes().length;
    return super.execute.apply(this, TOOLS.args(arguments));
  }

  executeArgs(args) {
    this._steps = this.pipes().length;
    return super.executeArgs(args);
  }

}