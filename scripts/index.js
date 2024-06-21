const { ipcRenderer } = require("electron");

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


window.addEventListener("DOMContentLoaded", (event) => {
  setInterval(() => {
    const l = location.href;
    if (isBlogDetail(l)) {
      const blogDetail = getBlogDetail();
      if (blogDetail) {
        ipcRenderer.send("askAi", blogDetail);
      }
    }
  }, 3000);
});
