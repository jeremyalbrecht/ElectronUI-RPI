'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
var ipc = electron.ipcMain;
const notifier = require('node-notifier');
const dialog = electron.dialog;
var mysql = require('mysql');
var fs = require('fs');

let mainWindow;
let settings;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  fs.readFile('info.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  settings = JSON.parse(data);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function(){
  createWindow();
  ipc.on('loadSettings', function(event, arg){
    fs.readFile('info.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    settings = JSON.parse(data);
    event.sender.send('replySettings', settings);
    });
  });

  ipc.on('saveIP', function(event, arg){
    console.log(arg);
    console.log(settings);
    if(arg == settings['ip']){
      return;
    }
    else {
      settings['ip'] = arg;
      fs.writeFile("info.json", JSON.stringify(settings), function(err) {
        if(err) {
            return console.log(err);
        }
      });
    }
  });

  ipc.on('saveCredentials', function(event, arg){
    var modified = false;
    if(arg[0] != settings['credentials']['user']){
      settings['credentials']['id'] = arg[0];
      modified = true;
    }
    if (arg[1] != settings['credentials']['password']){
      settings['credentials']['key'] = arg[1];
      modified = true;
    }
    if (modified){
      fs.writeFile("info.json", JSON.stringify(settings), function(err) {
        if(err) {
            return console.log(err);
        }
      });

    }
  });

  ipc.on('loadWOL', function(event, arg) {
    console.log(arg);  // prints "ping"
    var connection = mysql.createConnection({
      host     : '192.168.0.17',
      user     : 'root',
      password : 'Railchta2c',
      database : 'laravel'
    });
    connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
        console.log(err);
    }
    });
    var wol = [];

    connection.query('SELECT * FROM devices', function(err, rows, fields) {
      if (err) throw err;

      wol = rows;
      console.log(rows);
      event.sender.send('reply', wol);
    });
    connection.end();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
