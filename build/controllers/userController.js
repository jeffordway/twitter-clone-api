"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = exports.loginUser = exports.createUser = exports.findUsers = exports.getAllUsers = void 0;
const sequelize_1 = require("sequelize");
const users_1 = require("../models/users");
const authServices_1 = require("../services/authServices");
const error400User = 'User profile missing information';
const error401User = 'Unauthorized, user must be signed into account';
const error403User = 'Unauthorized, user may only edit their account or edit/delete their own messages.';
const error404SingleUser = 'Sorry, cannot find the user.';
const error404Users = 'Sorry, cannot find any users.';
const excludedCols = ['password'];
const getAllUsers = async (req, res, next) => {
    const authUser = await (0, authServices_1.verifyUser)(req);
    if (authUser) {
        const allUsers = await users_1.User.findAll({
            attributes: { exclude: excludedCols },
            order: [['username', 'DESC']]
        });
        if (allUsers.length === 0) {
            return res.status(404).send(error404Users);
        }
        return res.status(200).json(allUsers);
    }
    else {
        return res.status(401).send(error401User);
    }
};
exports.getAllUsers = getAllUsers;
const findUsers = async (req, res, next) => {
    const authUser = await (0, authServices_1.verifyUser)(req);
    if (authUser) {
        const searchParams = decodeURI(req.params.searchParams);
        const foundUsers = await users_1.User.findAll({
            attributes: { exclude: excludedCols },
            where: {
                [sequelize_1.Op.or]: [
                    { username: { [sequelize_1.Op.substring]: searchParams } },
                    { firstName: { [sequelize_1.Op.substring]: searchParams } },
                    { lastName: { [sequelize_1.Op.substring]: searchParams } },
                    { email: { [sequelize_1.Op.substring]: searchParams } },
                    { phone: { [sequelize_1.Op.substring]: searchParams } },
                ]
            },
            order: [['username', 'DESC']]
        });
        return res.status(200).json(foundUsers);
    }
    else {
        return res.status(401).send(error401User);
    }
};
exports.findUsers = findUsers;
const createUser = async (req, res, next) => {
    const newUser = req.body;
    try {
        if (newUser.username
            && newUser.password
            && newUser.firstName
            && newUser.lastName
            && newUser.email
            && newUser.phone) {
            const hashedPassword = await (0, authServices_1.hashPassword)(newUser.password);
            newUser.password = hashedPassword;
            const created = await users_1.User.create(newUser);
            return res.status(201).json({
                userId: created.userId,
                username: created.username,
                createdAt: created.createdAt,
            });
        }
        else {
            return res.status(400).send(error400User);
        }
    }
    catch (err) {
        return res.status(500).send(err);
    }
};
exports.createUser = createUser;
const loginUser = async (req, res, next) => {
    const loginUsernameOrEmail = req.body.usernameOrEmail;
    const loginPassword = req.body.password;
    const foundUser = await users_1.User.findOne({
        where: {
            [sequelize_1.Op.or]: [
                { username: loginUsernameOrEmail },
                { email: loginUsernameOrEmail }
            ]
        }
    });
    if (foundUser) {
        const matchingPasswords = await (0, authServices_1.comparePasswords)(loginPassword, foundUser.password);
        if (matchingPasswords) {
            const token = await (0, authServices_1.signUserToken)(foundUser);
            return res.status(200).json({ token });
        }
        else {
            return res.status(401).send('Incorrect Password');
        }
    }
    else {
        return res.status(401).send('Cannot find username or email');
    }
};
exports.loginUser = loginUser;
const getUser = async (req, res, next) => {
    const authUser = await (0, authServices_1.verifyUser)(req);
    if (authUser) {
        const uId = req.params.userId;
        const foundUser = await users_1.User.findByPk(uId, {
            attributes: { exclude: excludedCols }
        });
        if (foundUser) {
            return res.status(200).json(foundUser);
        }
        else {
            return res.status(404).send(error404SingleUser);
        }
    }
    else {
        return res.status(401).send(error401User);
    }
};
exports.getUser = getUser;
const updateUser = async (req, res, next) => {
    const authUser = await (0, authServices_1.verifyUser)(req);
    if (authUser) {
        const uId = parseInt(req.params.userId);
        const foundUser = await users_1.User.findByPk(uId);
        const updatedUser = req.body;
        updatedUser.userId = authUser.userId;
        const hashedPassword = await (0, authServices_1.hashPassword)(updatedUser.password);
        updatedUser.password = hashedPassword;
        if (foundUser) {
            if (authUser.userId != foundUser.userId) {
                return res.status(403).send(error403User);
            }
            await users_1.User.update(updatedUser, {
                where: { userId: authUser.userId }
            });
            return res.status(204).send();
        }
        else {
            return res.status(404).send(error404SingleUser);
        }
    }
    else {
        return res.status(401).send(error401User);
    }
};
exports.updateUser = updateUser;
