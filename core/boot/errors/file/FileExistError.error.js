'use strict'

module.exports = class FileExistError extends SYS.getError('FileError') {

  create(file) {
    return super.create(file, 'File "' + file.file() + '" already exist!');
  }

}
