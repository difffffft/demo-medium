const BaseModel = require("./BaseModel");
const { DataTypes, Sequelize } = require("sequelize");
const db = require("../db");

class Article extends BaseModel {
  static _init(sequelize) {
    const modelAttributes = {
      url: {
        type: DataTypes.STRING({ length: 500 }),
        allowNull: false,
        comment: "链接",
      },
      title: {
        type: DataTypes.STRING({ length: 500 }),
        allowNull: false,
        comment: "标题",
      },
      subTitle: {
        type: DataTypes.STRING({ length: 500 }),
        allowNull: true,
        comment: "小标题",
      },
      time: {
        type: DataTypes.STRING({ length: 255 }),
        allowNull: false,
        comment: "发布时间",
      },
      content: {
        type: DataTypes.TEXT({ length: 'long' }),
        comment: "内容",
      },
      isAnwser: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "0表示没回答，1表示已回答",
      },
      anwser: {
        type: DataTypes.TEXT({ length: 'long' }),
        comment: "AI总结",
      },
    };
    return super.initModel(modelAttributes, {
      sequelize,
      tableName: "article",
    });
  }
}

const ArticleModel = Article._init(db);

module.exports = ArticleModel;
