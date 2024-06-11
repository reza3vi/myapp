const { BrowserWindow, Menu, Tray, shell, ipcMain, crashReporter } = require('electron');
const AutoUpdater = require('./auto-updater');

const path = require('path');

class MainWindow {
	instance;
	autoUpdater;

	position = { width: 800, height: 600, maximized: false };

	constructor() {
		this.initTray();
		this.createWindow();

		crashReporter.start({ submitURL: 'https://your-domain.com/url-to-submit' });
	}

	createWindow() {
		this.instance = new BrowserWindow({
			width: this.position.width,
			height: this.position.height,
			show: false,
			removeMenu: true,
			acceptFirstMouse: true,
			autoHideMenuBar: true,
			icon: path.join(__dirname, 'icon.png'),
			webPreferences: {
				contextIsolation: true,
				// nodeIntegrationInWorker: true, // https://www.electronjs.org/docs/latest/tutorial/multithreading
				preload: path.join(__dirname, 'preload.js'),
			},
		});

		this.instance.webContents.setWindowOpenHandler((details) => {
			shell.openExternal(details.url);

			return { action: 'deny' };
		});

		this.instance.loadFile('dist/myapp/browser/index.html');

		this.instance.once('ready-to-show', () => {
			this.instance.show();

			if (this.position.maximized) this.instance.maximize();
		});

		this.autoUpdater = new AutoUpdater(this.instance);
	}

	initTray() {
		const tray = new Tray(path.join(__dirname, 'icon.png'));

		const contextMenu = Menu.buildFromTemplate([
			{ label: 'درباره ما', type: 'normal', click: () => shell.openExternal('https://reza3vi.ir/') },
			{ label: 'مشاهده آخرین تغییرات', type: 'normal', click: () => shell.openExternal('https://reza3vi.ir/raman') },
			{ type: 'separator' },
			{
				label: 'بررسی به‌روز رسانی',
				type: 'normal',
				click: ($event) => {
					$event.enabled = false;

					this.autoUpdater.checkForUpdates().then(() => ($event.enabled = true));
				},
			},
			{ type: 'separator' },
			{ label: 'خروج', type: 'normal', click: () => this.close() },
		]);

		tray.on('click', () => this.instance.show());
		tray.setToolTip('برنامه ی من');
		tray.setContextMenu(contextMenu);
	}

	close() {
		this.instance.close();

		ipcMain.removeAllListeners();
	}

	hide() {
		this.instance.hide();
	}

	openDevTools() {
		this.instance.webContents.openDevTools({ mode: 'undocked' });
	}
}

module.exports = MainWindow;
