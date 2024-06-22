const { ipcRenderer } = require("electron");

let blogList = []
let blogListFinish = false
let blogElementList = []

ipcRenderer.addListener("back", () => {
  history.back()
})

const isBlogDetail = (url) => {
  const pathRegex = /^https:\/\/medium\.com\/(.*)\/(.*)/;
  return pathRegex.test(url);
};

const isBlogList = (url) => {
  const pathRegex1 = /^https:\/\/medium\.com\/?feed=(.*)/;
  const pathRegex2 = /^https:\/\/medium\.com\/?tag=(.*)/;
  return url === 'https://medium.com/' || pathRegex1.test(url) || pathRegex2;
}

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


const firstLetterToLowerCase = (str) => {
  if (str.length === 0) return str;  // 处理空字符串的情况
  return str[0].toLowerCase() + str.slice(1);
}

const handleClickCategory = (category) => {
  const lowerCategory = firstLetterToLowerCase(category)
  const eles = document.querySelectorAll('#scroller-items button')
  const url = `https://medium.com/?tag=${lowerCategory}`
  if (url !== location.href) {
    for (let i = 0; i < eles.length; i++) {
      const ele = eles[i];
      if (ele.innerText === category) {
        ele.click()
        break
      }
    }
  }
}

const getBlogList = () => {
  blogElementList = []
  const main = document.querySelector('main')
  const eles = main.querySelectorAll('a:has(h2)')
  for (let i = 0; i < eles.length; i++) {
    const ele = eles[i];
    const regex = /^https:\/\/medium.com\/(.*\/.*)/;

    // https://medium.com/@lukwagoasuman236/how-i-hacked-my-first-public-wi-fi-network-s-60e19dd19f14
    // 域名/人名/文章名称/中划线/文章ID

    const match = regex.exec(ele.href);
    if (match) {
      const id = match[1];
      const url = "https://medium.com/" + id
      // 装载完成
      if (!blogListFinish) {
        blogList.push({
          url,
          isClick: false,
        })
      }
      ele.innerText = url
      blogElementList.push(ele)
    } else {
      console.log("No match");
    }
  }

  blogListFinish = true
}

const handleClickBlog = () => {
  let needClickElement = null

  for (let i = 0; i < blogList.length; i++) {
    const blog = blogList[i];
    if (!blog.isClick) {
      // 至少有一个没点
      blog.isClick = true
      needClickElement = blogElementList.find(e => e.innerText === blog.url)
      break
    }
  }

  // 全部点击完成
  if (!needClickElement) {
    console.log('全部点击完成......');
    // 清除数组
    blogList = []
    // 设置未装载完成
    blogListFinish = false
    // 刷新页面
    location.reload()
  } else {
    console.log('点击文章......');
    needClickElement.click()
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  let count = 0
  setInterval(() => {
    if(count >= 50){
      location.href =  "https://medium.com/"
      location.reload()
      return
    }
    const url = location.href;
    if (isBlogDetail(url)) {
      const blogDetail = getBlogDetail();
      if (blogDetail) {
        console.log('获取数据完成，......');
        ipcRenderer.send("saveAndAskAi", blogDetail);
        count = 0
      }
    } else if (isBlogList(url)) {
      handleClickCategory('Business')
      getBlogList();
      handleClickBlog()
      count = 0
    } else {
      history.back()
      count = 0
    }
    count++
  }, 3000);
});
