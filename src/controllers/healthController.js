import { Sequelize } from 'sequelize';
import config from '../config/config.json';

const sequelize = new Sequelize(config["development"]);

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

