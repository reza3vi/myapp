const { app, dialog, ipcMain } = require('electron');

const MainWindow = require('./app/main-window');
const AutoUpdater = require('./app/auto-updater');
const Notification = require('./app/notification');

const GlobalShortcut = require('./app/global-shortcut');

const fs = require('fs');

const isPackaged = !process.defaultApp;

// https://www.electronjs.org/docs/latest/api/clipboard

fs.writeFileSync('run.txt', isPackaged.toString());

// const path = require("node:path");

ipcMain.on('click', ($event, data) => $event.reply('click', data));

let window;
let autoUpdater;
let notification;
let globalShortcut;

function createWindow() {
	window = new MainWindow();
	autoUpdater = new AutoUpdater(window);
	notification = new Notification();
	globalShortcut = new GlobalShortcut();

	// window.openDevTools();
}

app.whenReady().then(async () => {
	createWindow();

	// globalShortcut.Register();

	autoUpdater.checkForUpdates().then();

	// notification.show('hi', 'خوش آمدید'); // .then((x) => notification.show('hi', '3333333333333333333333'));

	// let code = `
	// var p = document.getElementById("message");
	// p.innerHTML = "I am the changed text. ";
	// `;

	// win.webContents.executeJavaScript(code);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// app.on('will-quit', () => {
// 	globalShortcut.Unregister();
// });
