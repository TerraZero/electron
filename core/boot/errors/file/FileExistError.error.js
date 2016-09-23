'use strict';

const FileError = SYS.getError('FileError');

module.exports = class FileExistError extends FileError {

  createMessage() {
    return this.args('message') || 'File "<file>" already exist!';
  }

}
