const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
	checkForUpdate: () => ipcRenderer.send('click', 'checking...'),
	updateMessage: (callback) => ipcRenderer.send('click', callback),
});

window.addEventListener('DOMContentLoaded', function () {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector);

		element.addEventListener('click', () => ipcRenderer.send('click', text));

		if (element) element.innerText = text;
	};

	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, process.versions[type]);
	}

	ipcRenderer.on('click', ($event, param) => {
		document.getElementById('message').innerHTML = param;
	});
});
