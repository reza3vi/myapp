const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { shell, dialog } = require('electron');

const fs = require('fs');

let window;
let autoInstall = false;

function sendStatusToWindow(text, name = 'logger') {
	fs.writeFileSync(`${name}.log`, text);
	log.info(text);
}

autoUpdater.logger = log;
log.info('App starting...');

autoUpdater.on('checking-for-update', () => {});

autoUpdater.on('update-available', (info) => {
	sendStatusToWindow(JSON.stringify(info));

	dialog
		.showMessageBox({
			type: 'info',
			buttons: ['بله', 'خیر'],
			title: 'به‌روز رسانی',
			detail: `به‌روز رسانی جدید در دسترس می باشد، آیا مایل به دریافت آن هستید؟\n\nنسخه جاری: ${autoUpdater.currentVersion}\nنسخه جدید: ${info.version}`,
			checkboxLabel: 'بعد از دریافت بلافاصله نصب شود',
			checkboxChecked: true,
		})
		.then((res) => {
			if (res.response === 0) {
				autoInstall = res.checkboxChecked;

				autoUpdater.downloadUpdate();
			}
		});
});

autoUpdater.on('update-not-available', () => {});

autoUpdater.on('error', (err) => {
	sendStatusToWindow('error ' + err.message);

	dialog.showErrorBox('خطا', 'خطا در حال به‌روز رسانی');
});

autoUpdater.on('download-progress', (progressObj) => {
	let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
	log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
	log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
	sendStatusToWindow(log_message, 'percent');

	window.instance.setProgressBar(progressObj.percent);
});
autoUpdater.on('update-downloaded', (info) => {
	dialog
		.showMessageBox({
			type: 'info',
			buttons: ['نصب کن', 'فعلا نه'],
			title: `نسخه ${info.version}`,
			detail: 'نسخه جدید آماده نصب می باشد',
			checkboxLabel: 'تغییرات را نمایش بده',
			checkboxChecked: true,
		})
		.then((res) => {
			if (res.response === 0) {
				if (res.checkboxChecked) shell.openExternal('https://reza3vi.ir/raman');

				if (autoInstall) window.close();
			}
		});
});

class AutoUpdater {
	constructor(win) {
		window = win;

		autoUpdater.logger = log;
		autoUpdater.autoDownload = false;
		autoUpdater.autoInstallOnAppQuit = true;

		log.info('App starting...');
	}

	checkForUpdates() {
		return new Promise((resolve) => {
			autoUpdater
				.checkForUpdatesAndNotify({
					title: 'به‌روز رسانی',
					body: 'به‌روز رسانی جدید در دسترس می باشد',
				})
				.then(resolve(true))
				.catch(resolve(false));
		});
	}
}

module.exports = AutoUpdater;
