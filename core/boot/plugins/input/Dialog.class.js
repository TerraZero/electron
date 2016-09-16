'use strict';

const dialog = SYS.node('electron').remote.require('electron').dialog;

/**
  * @SysRoute(
  *   value="input.dialog",
  *   description="Handler for dialog inputs"
  * )
  */
module.exports = class Dialog {

  static chooseDir() {
    return dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
  }

  static chooseFile() {
    return dialog.showSaveDialog();
  }

};