const Article = require("../model/Article");

class ArticleService {
  constructor() {
    // this.articles = [];
  }

  // 获取所有文章
  // getAllArticles() {
  //     return this.articles;
  // }

  // 添加文章
  static async addArticle(article) {
    await Article.create(article);
  }
}

module.exports = ArticleService
