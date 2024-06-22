const path = require("path")
const { app, BrowserWindow } = require("electron");
const db = require("./db");
const { ipcMain } = require("electron");
const ArticleService = require("./service/ArticleService.js");
const Article = require("./model/Article");



const createWindow = () => {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      partition: "persist:medium",
      nodeIntegration: true,
      preload: path.join(__dirname, './scripts/index.js')
    },
  });

  win.loadURL("https://medium.com/");
  win.webContents.openDevTools()

  ipcMain.on('saveAndAskAi', (event, blogDetail, ) => {
    ArticleService.saveAndAskAi(blogDetail, win.webContents)
  })
};


const createDatabase = () => {
  (async () => {
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
    try {
      await Article.sync({ force: true });
      console.log("Database & tables created!");
    } catch (error) {
      console.error("Error syncing with database: ", error);
    }
  })();
}

app.whenReady().then(() => {
  createDatabase()
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
