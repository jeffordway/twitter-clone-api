"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const models_1 = require("./models");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
//express server
const app = (0, express_1.default)();
//morgan middleware
app.use((0, morgan_1.default)('dev'));
//express middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//cors middleware
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
//routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
//default error messaging
app.use((req, res, next) => {
    res.status(404).send();
});
//mysql database sync
models_1.db.sync({ alter: true }).then(() => {
    console.log('SUCCESS: You are connected to the database!');
});
//server listens on por 3000
app.listen(3000);
