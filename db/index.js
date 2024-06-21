const { Sequelize } = require("sequelize");
const { dbConfig } = require("../config");


/**
docker run -idt -p 3306:3306 --privileged=true \
-e TZ=Asia/Shanghai \
-e MYSQL_DATABASE=medium \
-e MYSQL_ROOT_PASSWORD=JGhQ83axm5ydtQEnX8B3RgtqnFIY6U3+TO5VMMVyLxA= \
--name medium mysql:8.0.20
 */

const db = new Sequelize(dbConfig);

db.beforeDefine((attributes, options) => {
  options.tableName = dbConfig.define?.tableName + options.tableName;
});

module.exports = db;