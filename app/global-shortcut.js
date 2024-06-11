const { globalShortcut } = require('electron');

const Notification = require('./notification');

class GlobalShortcut {
	notification;

	constructor() {
		this.notification = new Notification();
	}

	Register() {
		globalShortcut.register('CommandOrControl+X', () => {
			this.notification.show('hi', 'خوش آمدید');
		});
	}

	Unregister() {
		globalShortcut.unregisterAll();
	}
}

module.exports = GlobalShortcut;
