const { Notification: WindowsNotification } = require('electron/main');
const path = require('path');

class Notification {
	show(title, body) {
		return new Promise((resolve) => {
			new WindowsNotification({
				title,
				body,
				icon: path.join(__dirname, 'icon.png'),
				closeButtonText: 'بستن',
			})
				.on('click', () => resolve())
				.show();
		});
	}
}

module.exports = Notification;
