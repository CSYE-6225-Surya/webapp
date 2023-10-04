import express from 'express';
import identifyRoute from './src/middlewares/routeIdentifier';
import bodyParser from 'body-parser';
import { Sequelize } from 'sequelize';
import config from './src/config/config.json';
import fs from 'fs';
import { parse } from 'csv-parse';
import createUsers from './src/controllers/createUsers';
import logger from './src/libs/loggerLib';
import globalErrorMiddleware from './src/middlewares/appErrorHandler';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import routes from './src/routes/assignments';

dotenv.config();
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(identifyRoute);
app.use(globalErrorMiddleware.globalErrorHandler);

let userDetails = [];

fs.createReadStream("./src/files/sm.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        userDetails.push(row);
    })
    .on("end", function () {
        userDetails.map((row) => {
            createUsers.signUp(row[0], row[1], row[2], row[3]);
        });
    })
    .on("error", function (error) {
        console.log(error.message);
    });

const sequalize = new Sequelize(config["development"]);

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});

routes(app);

app.use(globalErrorMiddleware.globalNotFoundHandler);

const port = 3000;

sequalize.authenticate()
    .then(() => {
        console.log('Connected to PostgreSQL');
    })
    .catch(err => {
        console.log(err);
    });

export default app;