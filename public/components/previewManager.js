const { ipcMain, Menu } = require('electron');
const log = require('./log');
const getPreviewMenu = require('./previewMenu');

class PreviewManager {
  static showIndex() {
    if (!global.previewWindow) { return; }
    global.previewWindow.showIndex();
  }

  static send(...args) {
    if (!global.previewWindow) { return; }
    global.previewWindow.webContents.send(...args);
  }

  static quit() {
    global.previewWindow.close();
  }

  constructor() {
    this.menu = null;
  }

  start() {
    log.info('Start previewManager');
    this.menu = Menu.buildFromTemplate(getPreviewMenu(global.previewWindow));

    global.previewWindow.on('focus', () => {
      this.updateMenu();
    });

    ipcMain.on('preview:preview', (event, protocol, stageId) => {
      PreviewManager.send('remote:preview', protocol, stageId);
      global.previewWindow.show();
      this.updateMenu();
    });

    ipcMain.on('preview:clear', () => {
      PreviewManager.send('remote:reset');
      global.previewWindow.hide();
    });

    ipcMain.on('preview:close', () => {
      global.previewWindow.hide();
    });

    ipcMain.on('preview:reset', () => {
      global.previewWindow.loadIndex();
      PreviewManager.send('remote:reset');
    });

    PreviewManager.send('remote:reset');
  }

  updateMenu() {
    if (process.platform === 'win32' || process.platform === 'linux') {
      global.previewWindow.setMenu(this.menu);
    } else {
      Menu.setApplicationMenu(this.menu);
    }
  }
}

module.exports = PreviewManager;
