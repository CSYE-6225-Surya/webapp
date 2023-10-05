import model from '../models';
import generatePasswordLib from '../libs/generatePasswordLib';
import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';
import config from '../config/config.json';

const sequelize = new Sequelize(config["development"]);

const { Account } = model;

export default {
    async signUp(first_name, last_name, email, password) {
        try {
            let uuid = '';
            uuid = uuidv4();
            await sequelize.sync();
            const user = await Account.findOne({ where: { email } });
            if (user) {
                console.log('User account already exists');
                return;
            }
            let hash_password = generatePasswordLib.hashpassword(password);
            await Account.create({
                id: uuid,
                first_name,
                last_name,
                password: hash_password,
                email
            });
            console.log('Account created successfully!');
            return;
        } catch (e) {
            console.log(e);
        }
    }
}