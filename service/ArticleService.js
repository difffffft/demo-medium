const Article = require("../model/Article");
const { ipcMain } = require("electron");

class ArticleService {
  constructor() {
  }

  static async saveAndAskAi(blogDetail, webContents) {
    const article = await Article.findOne({
      where: {
        url: blogDetail.url
      }
    })

    if (article && article.isAnwser) {
      console.log("AI ing or end............");
      return
    } else {
      await Article.create({
        url: blogDetail.url,
        title: blogDetail.postTitle,
        subTitle: blogDetail.subtitleParagraph,
        time: blogDetail.publishDate,
        content: blogDetail.content,
        isAnwser: 1,
        anwser: ''
      });
    }

    console.log("AI ing............");

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
            content: "文章JSON信息:" + JSON.stringify(blogDetail),
          },
          {
            role: "user",
            content: `
            你现在是个非常穷的穷人，但是你能通过阅读，学习，思考，总结，来改变自己的命运，实现财务自由。
            你需要思考并回答以下内容:

            1.该文章是否具有商业价值。
            2.该文章是否具有创业方案，能否落地出产品与服务。
            3.确定你的产品或服务是否满足市场的需求，以及你的竞争优势是什么。
            4.你的商业模式应该清晰明确，包括收入来源、成本结构、利润预期等。这决定了你的企业如何盈利。
            5.明确你的目标客户是谁，他们的需求是什么，以及你如何能够最好地满足这些需求。
            6.如何拥有一个强大的团队至关重要。确定你的合作伙伴和员工，确保他们有能力和动力共同追求企业的目标。
            7.评估启动资金的需求，包括初期投资和运营资金。确定如何融资，并考虑长期的财务健康。
            8.了解和遵守相关的法律、规章和行业标准。这包括注册公司、知识产权保护、税务义务等。
            9.制定一个有效的市场营销计划，包括品牌建设、推广和销售渠道的选择。
            10.根据业务需求，评估并选择合适的技术和基础设施支持，确保业务运作的顺畅和效率。
            11.识别潜在的风险，并制定应对策略。这包括市场风险、财务风险、操作风险等方面。
            12.考虑企业的长远发展，制定可持续发展策略，包括扩展计划和创新战略。这些是创业过程中的一些关键考虑因素，每个因素都需要深入思考和具体规划，以提高创业成功的可能性。
            `
          },
        ],
        stream: false,
      }),
    })
      .then((res) => {
        res.json().then((data) => {
          console.log("AI end............");
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
      .finally(() => {
        console.log("back......");
        webContents.send('back')
      });
  };
}

module.exports = ArticleService
