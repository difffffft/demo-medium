const {
  DataTypes,
  Model,
  ModelAttributes,
  ModelOptions,
  Sequelize,
} = require("sequelize");
const moment = require("moment");

class BaseModel extends Model {
  toJSON() {
    const json = this.get();
    json.createdAt = moment(json.createdAt).format("YYYY-MM-DD HH:mm:ss");
    json.updatedAt = moment(json.updatedAt).format("YYYY-MM-DD HH:mm:ss");
    return json;
  }
  static initModel(attributes, options) {
    const modelAttributes = {
      id: {
        type: DataTypes.BIGINT({ length: 20 }),
        primaryKey: true,
        autoIncrement: true,
        comment: "主键id",
      },
      ...attributes,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "创建时间",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "修改时间",
      },
    };

    return super.init(modelAttributes, options);
  }
}

module.exports = BaseModel;
