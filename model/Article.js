const BaseModel = require("./BaseModel");
const { DataTypes, Sequelize } = require("sequelize");
const db = require("../db");

class Article extends BaseModel {
  static _init(sequelize) {
    const modelAttributes = {
      title: {
        type: DataTypes.STRING({ length: 255 }),
        allowNull: false,
        comment: "标题",
      },
    };
    return super.initModel(modelAttributes, {
      sequelize,
      tableName: "article",
    });
  }
}

const ArticleModel = Article._init(db);

setTimeout(() => {
  (async () => {
    try {
      await ArticleModel.sync({ force: true });
      console.log("Database & tables created!");
    } catch (error) {
      console.error("Error syncing with database: ", error);
    }
  })();

  (async () => {
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  })();
}, 3000);

module.exports = ArticleModel;
