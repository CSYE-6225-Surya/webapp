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
app.use(globalErrorMiddleware.globalErrorHandler);

let userDetails = [];

fs.createReadStream("./src/files/user.csv")
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

const db_username = process.env.DB_USER || config["development"].username;
const db_password = process.env.DB_PASSWORD || config["development"].password;
const db_name = process.env.DB_NAME || config["development"].database;
const db_port = process.env.DB_PORT || config["development"].port;
const db_host = process.env.DB_HOST || config["development"].host;
const dialect = config["development"].dialect;


const sequalize = new Sequelize({
    username: db_username,
    password: db_password,
    database: db_name,
    port: db_port,
    host: db_host,
    dialect: dialect,
});

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
        sequalize.sync({ force: true });
    })
    .catch(err => {
        console.log(err);
    });

export default app;