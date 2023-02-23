"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_1 = require("sequelize");
const messages_1 = require("./messages");
const users_1 = require("./users");
//sequelize variables
const dbName = 'trumpeterDb';
const username = 'root';
const password = 'Password1!';
const host = '127.0.0.1';
const port = 3306;
const dbType = 'mysql';
//sequelize db
const sequelize = new sequelize_1.Sequelize(dbName, username, password, {
    host: host,
    port: port,
    dialect: dbType
});
//Factories
(0, users_1.UserFactory)(sequelize);
(0, messages_1.MessageFactory)(sequelize);
//Associations
(0, messages_1.AssociateUserMessage)();
//database export
exports.db = sequelize;
