import { Sequelize } from "sequelize";
import { AssociateUserMessage, MessageFactory } from "./messages";
import { UserFactory } from "./users";

//sequelize variables
const dbName = 'trumpeterDb'
const username = 'root'
const password = 'Password1!'
const host = '127.0.0.1'
const port = 3306;
const dbType = 'mysql';

//sequelize db
const sequelize = new Sequelize(dbName, username, password, {
    host: host,
    port: port,
    dialect: dbType
});

//Factories
UserFactory(sequelize);
MessageFactory(sequelize);

//Associations
AssociateUserMessage();

//database export
export const db = sequelize;