import { RequestHandler } from "express";
import { Op } from "sequelize";
import { User } from "../models/users";
import { comparePasswords, hashPassword, signUserToken, verifyUser } from "../services/authServices";

const error400User = 'User profile missing information';
const error401User = 'Unauthorized, user must be signed into account';
const error403User = 'Unauthorized, user may only edit their account or edit/delete their own messages.';
const error404SingleUser = 'Sorry, cannot find the user.';
const error404Users = 'Sorry, cannot find any users.';
const excludedCols = ['password'];

export const getAllUsers: RequestHandler = async (req, res, next) => {
    const authUser: User | null = await verifyUser(req);
    if (authUser) {
        const allUsers = await User.findAll({
            attributes: { exclude: excludedCols },
            order: [['username', 'DESC']]
        });
        if (allUsers.length === 0) {
            return res.status(404).send(error404Users);
        }
        return res.status(200).json(allUsers);
    } else {
        return res.status(401).send(error401User);
    }
}

export const findUsers: RequestHandler = async (req, res, next) => {
    const authUser: User | null = await verifyUser(req);
    if (authUser) {
        const searchParams = decodeURI(req.params.searchParams);
        const foundUsers = await User.findAll({
            attributes: { exclude: excludedCols },
            where: {
                [Op.or]: [
                    { username: { [Op.substring]: searchParams } },
                    { firstName: { [Op.substring]: searchParams } },
                    { lastName: { [Op.substring]: searchParams } },
                    { email: { [Op.substring]: searchParams } },
                    { phone: { [Op.substring]: searchParams } },
                ]
            },
            order: [['username', 'DESC']]
        });
        return res.status(200).json(foundUsers);
    } else {
        return res.status(401).send(error401User);
    }
}

export const createUser: RequestHandler = async (req, res, next) => {
    const newUser: User = req.body;
    try {
        if (newUser.username
            && newUser.password
            && newUser.firstName
            && newUser.lastName
            && newUser.email
            && newUser.phone) {
            const hashedPassword = await hashPassword(newUser.password);
            newUser.password = hashedPassword;
            const created = await User.create(newUser);
            return res.status(201).json(
                {
                    userId: created.userId,
                    username: created.username,
                    createdAt: created.createdAt,
                }
            )
        }
        else {
            return res.status(400).send(error400User)
        }
    }
    catch (err) {
        return res.status(500).send(err);
    }
};

export const loginUser: RequestHandler = async (req, res, next) => {
    const loginUsernameOrEmail = req.body.usernameOrEmail;
    const loginPassword = req.body.password;
    const foundUser: User | null = await User.findOne({
        where: {
            [Op.or]: [
                { username: loginUsernameOrEmail },
                { email: loginUsernameOrEmail }
            ]
        }
    });
    if (foundUser) {
        const matchingPasswords = await comparePasswords(loginPassword, foundUser.password);
        if (matchingPasswords) {
            const token = await signUserToken(foundUser);
            return res.status(200).json({ token });
        } else {
            return res.status(401).send('Incorrect Password')
        }
    }
    else {
        return res.status(401).send('Cannot find username or email')
    }
}

export const getUser: RequestHandler = async (req, res, next) => {
    const authUser: User | null = await verifyUser(req);
    if (authUser) {
        const uId = req.params.userId;
        const foundUser: User | null = await User.findByPk(uId, {
            attributes: { exclude: excludedCols }
        });
        if (foundUser) {
            return res.status(200).json(foundUser);
        }
        else {
            return res.status(404).send(error404SingleUser);
        }
    } else {
        return res.status(401).send(error401User);
    }
}

export const updateUser: RequestHandler = async (req, res, next) => {
    const authUser: User | null = await verifyUser(req);
    if (authUser) {
        const uId = parseInt(req.params.userId);
        const foundUser = await User.findByPk(uId);
        const updatedUser: User = req.body;
        updatedUser.userId = authUser.userId;
        const hashedPassword = await hashPassword(updatedUser.password);
        updatedUser.password = hashedPassword;
        if (foundUser) {
            if (authUser.userId != foundUser.userId) {
                return res.status(403).send(error403User)
            }
            await User.update(updatedUser, {
                where: { userId: authUser.userId }
            });
            return res.status(204).send();

        } else {
            return res.status(404).send(error404SingleUser)
        }
    } else {
        return res.status(401).send(error401User);
    }
}