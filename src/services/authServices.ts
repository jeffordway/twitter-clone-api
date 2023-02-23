import bcrypt from 'bcrypt';
import { Request } from 'express';
import { User } from '../models/users';
import jwt from 'jsonwebtoken';

//jsonwebtoken secret
const secret = 'Do not dare not to dare.';

// password hashing
export const hashPassword = async (plainPassword: string) => {
    let saltRounds = 12;
    let hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
}

// compare password
export const comparePasswords = async (plainPassword: string, hashedPassword: string) => {
    let match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
}

//generate jwt token
export const signUserToken = async (user: User) => {
    let token = jwt.sign(
        { 
            userId: user.userId,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        },
        secret,
        { expiresIn: '1hr' }
    );
    return token;
}

//verify signed-in user
export const verifyUser = async (req: Request) => {
    let authHeader = req.headers.authorization;
    if (authHeader) {
        let token = authHeader.split(' ')[1];
        try {
            let decoded: any = await jwt.verify(token, secret);
            let user = await User.findByPk(decoded.userId);
            return user;
        }
        catch (err) {
            return null;
        }
    }
    else {
        return null;
    }
}