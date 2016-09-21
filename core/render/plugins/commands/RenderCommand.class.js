'use strict';

const Command = SYS.route('base.command');

/**
  * @Command(
  *   alias=["render"]
  * )
  */
module.exports = class RenderCommand extends Command {

  /**
    * @Command(
    *   description=["Build cache tpls"],
    *   options={
    *     a: {type: "boolean", description: "Print all debugging infos"},
    *     v: {type: "boolean", description: "Print only status messages"},
    *     e: {type: "boolean", description: "Show error's and warning's"},
    *     p: {type: "boolean", description: "Ignore the post process (clearing the compiling directory for debugging)"},
    *   }
    * )
    */
  build() {
    // vars
    const lookup = SYS.config('render:lookup');
    const target = new TOOLS.Path(':tpl').resolve();

    // args
    const all = this.arg('a', false);
    const verbose = all || this.arg('v', false);
    const error = all || this.arg('e', false);

    this.preProcess(target);

    const files = this.lookupFiles(lookup);

    const register = this.buildRegistry(files);

    this.copyForCompile(register, target);

    this.compile(target);

    this.postProcess(target);

    if (verbose) {
      if (all) this.log();
      this.log('[STATUS]: Render build completed');
    }
  }

  preProcess(target) {
    const all = this.arg('a', false);
    const verbose = all || this.arg('v', false);
    const logger = SYS.route('logger');

    if (verbose) this.log('[STATUS]: Clearing cache files');
    if (all) {
      this.log();
      TOOLS.File.clearDir(target, true, logger);
      this.log();
    } else {
      TOOLS.File.clearDir(target, true);
    }
    TOOLS.File.mkdir(target + '/compiling');
  }

  postProcess(target) {
    const post = this.arg('p', false);
    const all = this.arg('a', false);
    const verbose = all || this.arg('v', false);
    const logger = SYS.route('logger');

    if (all) this.log();
    if (post) {
      if (verbose) this.log('[STATUS]: Ignore clearing compiling files');
      return;
    }
    if (verbose) this.log('[STATUS]: Clearing compiling files');

    if (all) {
      this.log();
      TOOLS.File.clearDir(target + '/compiling', true, logger);
    } else {
      TOOLS.File.clearDir(target + '/compiling', true);
    }
  }

  compile(target) {
    const pug = SYS.node('pug');
    const fs = SYS.node('graceful-fs');

    const all = this.arg('a', false);
    const verbose = all || this.arg('v', false);

    const debug = SYS.config('render:debug');

    if (verbose) {
      if (all) this.log();
      this.log('[STATUS]: Compile template files');
      if (all) this.log();
    }

    var files = TOOLS.Path.glob('$' + target + '/compiling', '*.pug');

    for (var i in files) {
      var name = files[i].parse().name;
      var path = target + '/' + name + '.phtml';
      var compiled = pug.compileFileClient(files[i].resolve(), {
        compileDebug: debug,
        name: 'pugtemplate',
        basedir: target + '/compiling',
      });

      if (all) {
        this.log('Create template file: ' + path);
      }
      fs.writeFileSync(path, compiled + ';\nmodule.exports = pugtemplate;');
    }
  }

  lookupFiles(paths) {
    const all = this.arg('a', false);
    const verbose = all || this.arg('v', false);

    const files = [];

    for (var index in paths) {
      if (verbose) {
        this.log('[STATUS]: Lookup for "' + paths[index].name + '" template files');
      }
      files.push({
        name: paths[index].name,
        files: TOOLS.Path.glob(paths[index].path, '**/*.pug'),
      });
    }
    return files;
  }

  buildRegistry(files) {
    const register = {
      main: {},
    };

    for (var index in files) {
      register[files[index].name] = {};

      if (index === 0) {
        this.buildRegistryCore(register, files[index]);
      } else {
        this.buildRegistryOverride(register, files[index]);
      }
    }
    return register;
  }

  buildRegistryCore(register, files) {
    const all = this.arg('a', false);
    const verbose = all || this.arg('v', false);

    if (verbose) {
      if (all) this.log();
      this.log('[STATUS]: Register "' + files.name + '" templates');
      if (all) this.log();
    }
    for (var i in files.files) {
      var filename = files.files[i].parse().name;

      register.main[filename] = files.files[i];
      register[files.name][filename] = files.files[i];
      if (all) {
        this.log('Define template by "' + files.name + '": ' + filename);
      }
    }
  }

  buildRegistryOverride(register, files) {
    const all = this.arg('a', false);
    const verbose = all || this.arg('v', false);

    if (verbose) {
      if (all) this.log();
      this.log('[STATUS]: Register "' + files.name + '" templates');
      if (all) this.log();
    }
    for (var i in files.files) {
      var filename = files.files[i].parse().name;

      if (all) {
        if (register.main[filename] !== undefined) {
          this.log('Override template: ' + filename);
        } else {
          this.log('Create new template: ' + filename);
        }
      }
      register.main[filename] = files.files[i];
      register[files.name][filename] = files.files[i];
    }
  }

  getExtendNames(content) {
    const extending = {
      path: null,
      context: null,
      name: null,
      has: false,
    };
    var extend = content.match(/^\/\/\- extend (.*)$/m);

    if (extend) {
      extending.has = true;

      extending.path = extend[1];

      extend = extend[1].split('/');

      if (extend.length === 2) {
        extending.context = extend[0];
        extending.name = extend[1];
      } else {
        extending.context = 'main';
        extending.name =extend[0];
      }
    }
    return extending;
  }

  replaceExtend(register, content) {
    const all = this.arg('a', false);
    const error = all || this.arg('e', false);

    const extending = this.getExtendNames(content);
    if (!extending.has) return content;
    var extend = null;

    if (register[extending.context] && register[extending.context][extending.name]) {
      extend = register[extending.context][extending.name];
    } else {
      if (error) this.log('[WARNING]: Extend path "' + extending.path + '" not found!');
    }

    return 'extend ' + extend.resolveSub() + '\n' + content;
  }

  copyForCompile(register, target) {
    const all = this.arg('a', false);
    const verbose = all || this.arg('v', false);
    const error = all || this.arg('e', false);
    const fs = SYS.node('graceful-fs');

    if (all) this.log();

    for (var context in register) {
      if (verbose) this.log('[STATUS]: Copy files for "' + context + '" compiling');
      if (context !== 'main') TOOLS.File.mkdir(target + '/compiling/' + context);

      for (var name in register[context]) {
        var content = fs.readFileSync(register[context][name].resolve()).toString();

        if (context === 'main') {
          fs.writeFileSync(target + '/compiling/' + name + '.pug', content);
        } else {
          fs.writeFileSync(target + '/compiling/' + context + '/' + name + '.pug', content);
        }
      }
    }
  }

}