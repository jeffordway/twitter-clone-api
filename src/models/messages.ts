import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { User } from "./users";


export class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
    declare messageId: number;
    declare messageContents: string;
    declare userId: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;
};

export function MessageFactory(sequelize: Sequelize) {
    Message.init(
        {
            messageId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            messageContents: {
                type: DataTypes.STRING,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            tableName: 'messages',
            freezeTableName: true,
            sequelize
        }

    );
};

export function AssociateUserMessage() {
    User.hasMany(Message, { foreignKey: 'userId' });
    Message.belongsTo(User, { foreignKey: 'userId' });
};