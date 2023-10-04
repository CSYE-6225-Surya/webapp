import model from '../models';
import response from '../libs/responseLib';
import check from '../libs/checkLib';
import logger from '../libs/loggerLib';
import passwordLib from '../libs/generatePasswordLib';

const { Account } = model;

const authenticate = async (req, res, next) => {
    let accountDetails;
    const authheader = req.headers.authorization;
    if (!authheader) {
        res.setHeader('WWW-Authenticate', 'Basic');
        let apiResponse = response.generate(true, 'No Authentication Header', 401, null);
        res.status(apiResponse.status).send(apiResponse);
        return;
    }
    const auth = new Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');
    const email = auth[0];
    const pass = auth[1];
    try {
        accountDetails = await Account.findOne({ where: { email } });
    } catch (err) {
        logger.error(err.message, 'Authentication', 10);
        let apiResponse = response.generate(true, 'Failed to find User Details', 503, null);
        res.status(apiResponse.status).send(apiResponse);
        return;
    }
    if (check.isEmpty(accountDetails)) {
        logger.info('No Users Found', 'Authentication')
        let apiResponse = response.generate(true, 'Not an Authenticated User', 401, null);
        res.status(apiResponse.status).send(apiResponse);
        return;
    } else if (!passwordLib.comparePasswordSync(pass, accountDetails.password)) {
        let apiResponse = response.generate(true, 'User email and password does not match', 401, null);
        res.status(apiResponse.status).send(apiResponse);
        return;
    }
    next();
}

const getUserEmail = (req, res) => {
    const authheader = req.headers.authorization;
    if (!authheader) {
        return '';
    }
    const auth = new Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');
    const email = auth[0];
    const pass = auth[1];
    return email;
}

export default {
    authenticate: authenticate,
    getUserEmail: getUserEmail
};