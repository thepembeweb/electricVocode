
import {
  app,
  BrowserWindow,
  globalShortcut,
  Tray,
  ipcMain,
  Menu
} from 'electron';
import MenuBuilder from './menu';
import path from 'path';

let mainWindow = null;
let tray = null;
const iconPath1 = path.join(__dirname, 'dist', 'resources', 'triangle-blue.png');
const iconPath2 = path.join(__dirname, 'dist', 'resources', 'triangle-red.png');
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.error);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  // TRAY AND TRAY LISTENERS
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        app.isQuiting = true;
        globalShortcut.unregisterAll();
        app.quit();
      }
    }
  ]);
  tray = new Tray(iconPath1);

  tray.setContextMenu(contextMenu);

  // global listener to open tray from any app:
  globalShortcut.register('Alt+S', () => {
    tray.popUpContextMenu();
  });

  ipcMain.on('startRecording', () => {
    tray.setImage(iconPath2);
  });
  ipcMain.on('stopRecording', () => {
    tray.setImage(iconPath1);
  });

  //WINDOW NAV LISTENERS
  //Event from app/utils/interpreter - show a web page, etc
  ipcMain.on('popUp', () => {
    mainWindow.show();
  });

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('minimize', function(event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', event => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
