"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.signUserToken = exports.comparePasswords = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = require("../models/users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//jsonwebtoken secret
const secret = 'Do not dare not to dare.';
// password hashing
const hashPassword = async (plainPassword) => {
    let saltRounds = 12;
    let hash = await bcrypt_1.default.hash(plainPassword, saltRounds);
    return hash;
};
exports.hashPassword = hashPassword;
// compare password
const comparePasswords = async (plainPassword, hashedPassword) => {
    let match = await bcrypt_1.default.compare(plainPassword, hashedPassword);
    return match;
};
exports.comparePasswords = comparePasswords;
//generate jwt token
const signUserToken = async (user) => {
    let token = jsonwebtoken_1.default.sign({
        userId: user.userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    }, secret, { expiresIn: '1hr' });
    return token;
};
exports.signUserToken = signUserToken;
//verify signed-in user
const verifyUser = async (req) => {
    let authHeader = req.headers.authorization;
    if (authHeader) {
        let token = authHeader.split(' ')[1];
        try {
            let decoded = await jsonwebtoken_1.default.verify(token, secret);
            let user = await users_1.User.findByPk(decoded.userId);
            return user;
        }
        catch (err) {
            return null;
        }
    }
    else {
        return null;
    }
};
exports.verifyUser = verifyUser;
