import express, { NextFunction, Request, Response } from "express"
import morgan from "morgan";
import { db } from "./models";
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';

//express server
const app = express();

//morgan middleware
app.use(morgan('dev'));

//express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors middleware
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes)

//default error messaging
app.use((req: Request, res: Response, next: NextFunction) =>{
    res.status(404).send();
});

//mysql database sync
db.sync({alter: true}).then(() => {
    console.log('SUCCESS: You are connected to the database!');
});

//server listens on por 3000
app.listen(3000);