const path = require("path")
const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      partition: "persist:x",
      nodeIntegration: true,
      preload: path.join(__dirname, './scripts/index.js')
    },
  });

  win.loadURL("https://medium.com/");
  win.webContents.openDevTools()

//   win.webContents.on("dom-ready", () => {
//     console.log("DOM is ready!");
//   });
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
