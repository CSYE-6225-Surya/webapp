import { Sequelize } from 'sequelize';
import config from '../config/config.json';

const db_username = process.env.DB_USER || config["development"].username;
const db_password = process.env.DB_PASSWORD || config["development"].password;
const db_name = process.env.DB_NAME || config["development"].database;
const db_port = process.env.DB_PORT || config["development"].port;
const db_host = process.env.DB_HOST || config["development"].host;
const dialect = config["development"].dialect;


const sequelize = new Sequelize({
    username: db_username,
    password: db_password,
    database: db_name,
    port: db_port,
    host: db_host,
    dialect: dialect,
});

const getHealth = (req, res) => {
    if (typeof req.body == 'object' && Object.keys(req.body).length !== 0) {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    } else if (typeof req.body == 'string') {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    } else if (req.headers['content-type'] !== undefined && req.headers['content-length'] > 0) {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    } else if (typeof req.query == 'object' && Object.keys(req.query).length !== 0 && Object.values(req.query).length !== 0) {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    } else if (req.url !== '/healthz') {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    } else {
        sequelize.authenticate()
            .then(() => {
                console.log('Connected to PostgreSQL');
                res.status(200).setHeader('cache-control', 'no-cache').send();
                return;
            })
            .catch(err => {
                console.log(err);
                res.status(503).setHeader('cache-control', 'no-cache').send();
                return;
            });
    }
};

export default { getHealth: getHealth }

