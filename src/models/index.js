import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import enVariables from '../config/config.json';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = enVariables[env];
const db = {};

const db_username = process.env.DB_USER || config.username;
const db_password = process.env.DB_PASSWORD || config.password;
const db_name = process.env.DB_NAME || config.database;
const db_port = process.env.DB_PORT || config.port;
const db_host = process.env.DB_HOST || config.host;
const dialect = config.dialect;
let newConfig = {
  username: db_username,
  password: db_password,
  database: db_name,
  port: db_port,
  host: db_host,
  dialect: dialect
}
let sequelize;
sequelize = new Sequelize(db_name, db_username, db_password, newConfig);

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const model = require(path.join(__dirname, file)).default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;