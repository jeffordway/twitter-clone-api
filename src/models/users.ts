import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";


export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare userId: number;
    declare username: string;
    declare password: string;
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare phone: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
};

export function UserFactory(sequelize: Sequelize) {
    User.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: 'users',
            freezeTableName: true,
            sequelize
        }
    );
};