// 'use strict'
// const logger = require('pino')()
// const moment = require('moment')

import pino from 'pino';
import moment from 'moment';
let logFilePath;

if (process.env.NODE_ENV === 'workflow') {
    // Set the log file path for GitHub Workflows
    logFilePath = `${process.env.GITHUB_WORKSPACE}/log-file.log`;
} else {
    // Set the log file path for local development or other environments
    logFilePath = '../../logs/log-file.log';
}
const logger = pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
    // formatters: {
    //   level: (label) => {
    //     return { level: label.toUpperCase() };
    //   },
    // },
    // timestamp: pino.stdTimeFunctions.isoTime,
},
    pino.destination(logFilePath));
// myErrorFunction is a definition of how the errors will be formatted in our system
let captureError = (errorMessage, errorOrigin, errorLevel) => {
    let currentTime = moment()

    let errorResponse = {
        timestamp: currentTime,
        errorMessage: errorMessage,
        errorOrigin: errorOrigin,
        errorLevel: errorLevel
    }
    logger.error(errorResponse);
    return errorResponse
} // end captureError

let captureInfo = (message, origin, importance) => {
    let currentTime = moment()

    let infoMessage = {
        timestamp: currentTime,
        message: message,
        origin: origin,
        level: importance
    }
    logger.info(infoMessage)
    return infoMessage;
} // end infoCapture

export default {
    error: captureError,
    info: captureInfo
}
