import { RequestHandler } from "express";
import { Op, Sequelize, where } from "sequelize";
import { Message } from "../models/messages";
import { User } from "../models/users";
import { verifyUser } from "../services/authServices";

const error400Message = 'Message has no contents';
const error401User = 'Unauthorized, user must be signed into account';
const error403User = 'Unauthorized, user may only edit their account or edit/delete their own messages.';
const error404SingleMessage = 'Sorry, cannot find the message.';
const error404Messages = 'Sorry, cannot find any messages.';
const excludedCols = ['userId', 'password', 'email', 'phone', 'createdAt', 'updatedAt'];

export const getAllMessages: RequestHandler = async (req, res, next) => {
    const allMessages = await Message.findAll({
        include: {
            model: User,
            attributes: { exclude: excludedCols },
        },
        order: [['createdAt', 'DESC']]

    });
    // if (allMessages.length === 0) {
    //     return res.status(404).send(error404Messages);
    // }
    return res.status(200).json(allMessages);
}

export const findMessages: RequestHandler = async (req, res, next) => {
    const searchParams = decodeURI(req.params.searchParams);
    const foundMessages = await Message.findAll({
        include: {
            model: User,
            attributes: { exclude: excludedCols },
        },
        where: {
            [Op.or]: [
                { messageContents: { [Op.substring]: searchParams } },
                { '$User.username$': { [Op.substring]: searchParams } },
                { '$User.firstName$': { [Op.substring]: searchParams } },
                { '$User.lastName$': { [Op.substring]: searchParams } },
            ]
        },
        order: [['createdAt', 'DESC']]
    });
    if (foundMessages.length === 0) {
        return res.status(404).send(error404Messages);
    }
    return res.status(200).json(foundMessages);
}

export const createMessage: RequestHandler = async (req, res, next) => {
    const authUser: User | null = await verifyUser(req);
    if (authUser) {
        const newMessage: Message = req.body;
        newMessage.userId = authUser.userId;
        if (newMessage.messageContents) {
            const createMessage = await Message.create(newMessage);
            res.status(201).json(createMessage);
        } else {
            return res.status(400).send(error400Message);
        }
    } else {
        return res.status(401).send(error401User);
    }
}

export const getOneMessage: RequestHandler = async (req, res, next) => {
    const mId = req.params.messageId;
    const foundMessage = await Message.findByPk(mId, {
        include: {
            model: User,
            attributes: { exclude: excludedCols }
        }
    });
    if (foundMessage) {
        return res.status(200).json(foundMessage)
    } else {
        return res.status(404).send(error404SingleMessage);
    }
}

export const updateMessage: RequestHandler = async (req, res, next) => {
    const authUser: User | null = await verifyUser(req);
    if (authUser) {
        const mId = parseInt(req.params.messageId);
        const foundMessage = await Message.findByPk(mId);
        const updatedMessage: Message = req.body;
        updatedMessage.userId = authUser.userId;
        updatedMessage.messageId = mId;
        if (foundMessage
            && foundMessage.messageId == updatedMessage.messageId
            && updatedMessage.messageContents) {
            if (authUser.userId != foundMessage.userId) {
                return res.status(403).send(error403User);
            }
            await Message.update(updatedMessage, {
                where: { messageId: mId }
            });
            return res.status(204).send();
        } else {
            return res.status(404).send(error404SingleMessage);
        }
    } else {
        return res.status(401).send(error401User);
    }
}

export const deleteMessage: RequestHandler = async (req, res, next) => {
    const authUser: User | null = await verifyUser(req);
    if (authUser) {
        const mId = req.params.messageId;
        const foundMessage = await Message.findByPk(mId);
        if (foundMessage) {
            if (authUser.userId != foundMessage.userId) {
                return res.status(403).send(error403User);
            }
            await Message.destroy({
                where: { messageId: mId }
            });
            return res.status(204).send()
        } else {
            return res.status(404).send(error404SingleMessage)
        }
    } else {
        return res.status(401).send(error401User);
    }
}