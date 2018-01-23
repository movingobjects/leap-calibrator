
const { app, BrowserWindow } = require('electron');

require('electron-reload')(__dirname + '/app/build/');

let win; // (prevents garbage collection)

app.on('ready', () => {

  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    fullscreen: true,
    fullscreenable: true
  });

  win.loadURL(`file://${__dirname}/app/build/index.html`);

});

app.on('window-all-closed', () => {

  app.quit();

});
