const { app, BrowserWindow } = require("electron/main");
const { ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

const fs = require("fs");

const isPackaged = !process.defaultApp;

fs.writeFileSync("run.txt", isPackaged.toString());

const path = require("node:path");

ipcMain.on("click", ($event, data) => $event.reply("click", data));

autoUpdater.logger = log;
log.info("App starting...");

function sendStatusToWindow(text) {
  fs.writeFileSync("logger.log", text);
  log.info(text);

  // win.webContents.send("message", text);
}

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    removeMenu: true,
    acceptFirstMouse: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("dist/myapp/browser/index.html");

  win.webContents.openDevTools();
}

app.whenReady().then(async () => {
  log.transports.file.level = "debug";
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("ready", function () {
    autoUpdater.updateConfigPath = path.join(__dirname, "app-update.yml");

    autoUpdater.checkForUpdatesAndNotify();
  });

  // process.env.GH_TOKEN = "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";

  // win.webContents.send(
  //   "updateMessage",
  //   `Checking for updates. Current version ${app.getVersion()}`
  // );

  // win.once("ready-to-show", () => {
  // autoUpdater.setFeedURL({
  //   provider: "github",
  //   url: "https://github.com/reza3vi/myapp",
  //   channel: "latest",
  // });
  // autoUpdater.checkForUpdatesAndNotify().then((res) => {
  //   fs.writeFileSync("res.txt", JSON.stringify(res));
  // });
  // });

  // autoUpdater.checkForUpdates();

  // dialogger.showMessageBox(
  //   {
  //     type: "info",
  //     buttons: ["Restart", "Update"],
  //     title: `${"appName"} Update`,
  //     detail: `A new version has been downloaded. Restart ${"appName"} to apply the updates.`,
  //   },
  //   (res) => {
  //     console.log("res: ", res);
  //     console.log("message: ", message);
  //   }
  // );

  // let code = `
  // var p = document.getElementById("message");
  // p.innerHTML = "I am the changed text. ";
  // `;

  // win.webContents.executeJavaScript(code);
});

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("Update available.");

  dialog.showMessageBox(
    {
      type: "info",
      buttons: ["بروز رسانی"],
      title: `بروز رسانی برنامه`,
      detail: `بروز رسانی را دانلود کنید`,
    },
    (res) => {
      autoUpdater.downloadUpdate();
      sendStatusToWindow("Update available. ver: " + autoUpdater.currentVersion);

      console.log("res: ", res);
      console.log("message: ", message);
    }
  );
});
autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
  sendStatusToWindow("Error in auto-updater. " + err);
});
autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});
autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("Update downloaded");
});
// autoUpdater.on("update-available", (info) => {
//   fs.writeFileSync("update-available.txt", info);

//   dialogger.showMessageBox(
//     {
//       type: "info",
//       buttons: ["Restart", "Update"],
//       title: `${"appName"} Update`,
//       detail: JSON.stringify(info),
//     },
//     (res) => {
//       console.log("res: ", res);
//       console.log("message: ", message);
//     }
//   );

//   const path = autoUpdater.downloadUpdate();
//   console.log("path: ", path);
// });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
