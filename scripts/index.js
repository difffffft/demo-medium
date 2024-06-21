const { ipcRenderer } = require("electron");
const ArticleService = require("../service/ArticleService.js");

const isBlogDetail = (url) => {
  const pathRegex = /^https:\/\/medium\.com\/(.*)\/(.*)/;
  return pathRegex.test(url);
};

const getBlogDetail = () => {
  const url = location.href;
  const postTitleEle = document.querySelector(".pw-post-title");
  const postTitle = postTitleEle ? postTitleEle.innerText : "没有";

  if (postTitle === "没有") {
    return null;
  }

  const subtitleParagraphEle = document.querySelector(".pw-subtitle-paragraph");
  const subtitleParagraph = subtitleParagraphEle
    ? subtitleParagraphEle.innerText
    : "没有";
  const publishDateEle = document.querySelector(
    '[data-testid="storyPublishDate"]'
  );
  const publishDate = publishDateEle ? publishDateEle.innerText : "未知";

  let content = "";
  const bodys = document.querySelectorAll(".pw-post-body-paragraph");
  bodys.forEach((body) => {
    content += body.innerText + "\n";
  });

  return {
    url,
    postTitle,
    subtitleParagraph,
    publishDate,
    content,
  };
};

let askCount = 0;

const askAi = (blogDetail) => {
  if (askCount >= 1) {
    return;
  }
  askCount++;
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
          content: "使用中文翻译这篇文章，并给出你的评价和思考",
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
        console.log("AI总结:" + data.choices[0].message.content);
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {});
};

window.addEventListener("DOMContentLoaded", (event) => {
  setInterval(() => {
    const l = location.href;
    if (isBlogDetail(l)) {
      const blogDetail = getBlogDetail();
      if (blogDetail) {
        ArticleService.addArticle({
          title: blogDetail.postTitle,
        });
        // askAi(blogDetail);
      }
      // console.log(blogDetail);
    }
  }, 3000);

  // h1
  // https://medium.com/illumination/how-to-detect-an-ai-written-article-b4b33ecba3a7'
  // setInterval(() => {
  //   list = [];
  //   // 每一篇文章
  //   const articles = document.querySelectorAll('[data-testid="cellInnerDiv"]');
  //   for (let i = 0; i < articles.length; i++) {
  //     let id;
  //     let content;
  //     const article = articles[i];
  //     const time = article.querySelector("time");
  //     if (time) {
  //       id = time.dateTime;
  //     }
  //     const contentItem = article.querySelector('[data-testid="tweetText"] span');
  //     if (contentItem) {
  //       content = contentItem.innerText;
  //     }
  //     list.push({
  //       id,
  //       content,
  //     });
  //   }
  //   console.log(list);
  // }, 3000);
  // // data-testid="cellInnerDiv"
  // // const tweetText = document.querySelectorAll('[data-testid="tweetText"] span');
  // // console.log(tweetText);
  // //   ipcRenderer.send("tweet-text", tweetText);
});
