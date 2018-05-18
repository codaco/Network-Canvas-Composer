const electron = require('electron');
const path = require('path');
const url = require('url');
const os = require('os');
const log = require('electron-log');
require('./components/updater');
const registerProtocolProtocol = require('./components/protocolProtocol').registerProtocolProtocol;

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const isMacOS = () => os.platform() === 'darwin';

const titlebarParameters = isMacOS() ? { titleBarStyle: 'hidden', frame: false } : {};

const windowParameters = Object.assign({
  width: 1440,
  height: 900,
  minWidth: 1280,
  minHeight: 800,
  center: true,
  title: 'Network Canvas Architect'

}, titlebarParameters);

log.info('App starting...');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function getAppUrl() {
  if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_DEV_SERVER_PORT) {
    return url.format({
      host: `localhost:${process.env.WEBPACK_DEV_SERVER_PORT}/`,
      protocol: 'http'
    });
  }

  return url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:'
  });
}

function createWindow() {
  registerProtocolProtocol();

  // Create the browser window.
  mainWindow = new BrowserWindow(windowParameters);
  mainWindow.maximize();

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  // and load the index.html of the app.
  mainWindow.loadURL(getAppUrl());

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
