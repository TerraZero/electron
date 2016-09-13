'use strict';

const Command = SYS.route('base.command');

/**
  * @Command(
  *   alias=["cache"]
  * )
  */
module.exports = class CacheCommand extends Command {

  /**
    * @Command(
    *   description=["Build cache tpls"],
    *   options={
    *     v: {type: "boolean", description: "Print for debug"},
    *   }
    * )
    */
  build() {
    const pug = SYS.node('pug');
    const files = TOOLS.Path.glob(':pug', '**/*.pug');
    const fs = SYS.node('graceful-fs');
    const debug = SYS.setting('pug').debug;
    const verbose = this.arg('v', false);
    const target = new TOOLS.Path(':tpl').resolve();

    for (var f in files) {
      var name = files[f].parse().name;
      var path = target + '/pug' + name + '.phtml';
      var html = pug.compileFileClient(files[f].resolve(), {
        compileDebug: debug,
        name: 'pug' + name,
      });

      if (verbose) {
        SYS.route('logger').log('Create cache file: ' + path);
      }
      fs.writeFileSync(path, html + ';\nmodule.exports = pug' + name + ';');
    }
  }

}