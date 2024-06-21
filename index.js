const path = require("path")
const { app, BrowserWindow } = require("electron");
const db = require("./db");
const { ipcMain } = require("electron");
const ArticleService = require("./service/ArticleService.js");
const Article = require("./model/Article");

const askAi = async (blogDetail) => {

  const article = await Article.findOne({
    where: {
      url: blogDetail.url
    }
  })

  if (article && article.isAnwser) {
    return
  } else {
    Article.create({
      url: blogDetail.url,
      title: blogDetail.postTitle,
      subTitle: blogDetail.subtitleParagraph,
      time: blogDetail.publishDate,
      content: blogDetail.content,
      isAnwser: 1,
      anwser: ''
    });
  }

  // 询问这篇文章是做什么的，具有什么商业价值，中文描述一下
  fetch("http://localhost:11434/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen2",
      messages: [
        {
          role: "user",
          content: "使用中文翻译这篇文章，并给出你的评价和思考, 记住使用中文回答，记住使用中文回答，记住使用中文回答，记住使用中文回答.",
        },
        {
          role: "user",
          content: JSON.stringify(blogDetail),
        },
      ],
      stream: false,
    }),
  })
    .then((res) => {
      res.json().then((data) => {
        // console.log("AI总结:" + data.choices[0].message.content);
        const content = data.choices[0].message.content;
        Article.update({
          anwser: content
        }, {
          where: {
            url: blogDetail.url
          }
        });
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => { });
};

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
  // win.loadFile('index.html');


  ipcMain.on('askAi', (event, blogDetail) => {
    // askAi(blogDetail)
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

// ipcRenderer.on("createArticle", (event) => {
//   // ArticleService.addArticle({
//   //   title: blogDetail.postTitle,
//   // });
// });


// setTimeout(() => {
//   (async () => {
// try {
//   await ArticleModel.sync({ force: true });
//   console.log("Database & tables created!");
// } catch (error) {
//   console.error("Error syncing with database: ", error);
// }
//   })();

//   (async () => {
//     try {
//       await db.authenticate();
//       console.log("Connection has been established successfully.");
//     } catch (error) {
//       console.error("Unable to connect to the database:", error);
//     }
//   })();
// }, 3000);

app.whenReady().then(() => {
  createDatabase()
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
