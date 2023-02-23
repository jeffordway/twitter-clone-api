"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.updateMessage = exports.getOneMessage = exports.createMessage = exports.findMessages = exports.getAllMessages = void 0;
const sequelize_1 = require("sequelize");
const messages_1 = require("../models/messages");
const users_1 = require("../models/users");
const authServices_1 = require("../services/authServices");
const error400Message = 'Message has no contents';
const error401User = 'Unauthorized, user must be signed into account';
const error403User = 'Unauthorized, user may only edit their account or edit/delete their own messages.';
const error404SingleMessage = 'Sorry, cannot find the message.';
const error404Messages = 'Sorry, cannot find any messages.';
const excludedCols = ['userId', 'password', 'email', 'phone', 'createdAt', 'updatedAt'];
const getAllMessages = async (req, res, next) => {
    const allMessages = await messages_1.Message.findAll({
        include: {
            model: users_1.User,
            attributes: { exclude: excludedCols },
        },
        order: [['createdAt', 'DESC']]
    });
    // if (allMessages.length === 0) {
    //     return res.status(404).send(error404Messages);
    // }
    return res.status(200).json(allMessages);
};
exports.getAllMessages = getAllMessages;
const findMessages = async (req, res, next) => {
    const searchParams = decodeURI(req.params.searchParams);
    const foundMessages = await messages_1.Message.findAll({
        include: {
            model: users_1.User,
            attributes: { exclude: excludedCols },
        },
        where: {
            [sequelize_1.Op.or]: [
                { messageContents: { [sequelize_1.Op.substring]: searchParams } },
                { '$User.username$': { [sequelize_1.Op.substring]: searchParams } },
                { '$User.firstName$': { [sequelize_1.Op.substring]: searchParams } },
                { '$User.lastName$': { [sequelize_1.Op.substring]: searchParams } },
            ]
        },
        order: [['createdAt', 'DESC']]
    });
    if (foundMessages.length === 0) {
        return res.status(404).send(error404Messages);
    }
    return res.status(200).json(foundMessages);
};
exports.findMessages = findMessages;
const createMessage = async (req, res, next) => {
    const authUser = await (0, authServices_1.verifyUser)(req);
    if (authUser) {
        const newMessage = req.body;
        newMessage.userId = authUser.userId;
        if (newMessage.messageContents) {
            const createMessage = await messages_1.Message.create(newMessage);
            res.status(201).json(createMessage);
        }
        else {
            return res.status(400).send(error400Message);
        }
    }
    else {
        return res.status(401).send(error401User);
    }
};
exports.createMessage = createMessage;
const getOneMessage = async (req, res, next) => {
    const mId = req.params.messageId;
    const foundMessage = await messages_1.Message.findByPk(mId, {
        include: {
            model: users_1.User,
            attributes: { exclude: excludedCols }
        }
    });
    if (foundMessage) {
        return res.status(200).json(foundMessage);
    }
    else {
        return res.status(404).send(error404SingleMessage);
    }
};
exports.getOneMessage = getOneMessage;
const updateMessage = async (req, res, next) => {
    const authUser = await (0, authServices_1.verifyUser)(req);
    if (authUser) {
        const mId = parseInt(req.params.messageId);
        const foundMessage = await messages_1.Message.findByPk(mId);
        const updatedMessage = req.body;
        updatedMessage.userId = authUser.userId;
        updatedMessage.messageId = mId;
        if (foundMessage
            && foundMessage.messageId == updatedMessage.messageId
            && updatedMessage.messageContents) {
            if (authUser.userId != foundMessage.userId) {
                return res.status(403).send(error403User);
            }
            await messages_1.Message.update(updatedMessage, {
                where: { messageId: mId }
            });
            return res.status(204).send();
        }
        else {
            return res.status(404).send(error404SingleMessage);
        }
    }
    else {
        return res.status(401).send(error401User);
    }
};
exports.updateMessage = updateMessage;
const deleteMessage = async (req, res, next) => {
    const authUser = await (0, authServices_1.verifyUser)(req);
    if (authUser) {
        const mId = req.params.messageId;
        const foundMessage = await messages_1.Message.findByPk(mId);
        if (foundMessage) {
            if (authUser.userId != foundMessage.userId) {
                return res.status(403).send(error403User);
            }
            await messages_1.Message.destroy({
                where: { messageId: mId }
            });
            return res.status(204).send();
        }
        else {
            return res.status(404).send(error404SingleMessage);
        }
    }
    else {
        return res.status(401).send(error401User);
    }
};
exports.deleteMessage = deleteMessage;
