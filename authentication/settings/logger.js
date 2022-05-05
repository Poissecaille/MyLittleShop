var winston = require('winston');
var path = require('path');
var logPath = __dirname;
const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { service: 'Authentication service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logPath, '../logs/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logPath, '../logs/debug.log'), level: 'debug' }),
        new winston.transports.File({ filename: path.join(logPath, '../logs/combined.log') }),
    ],
});

module.exports = logger;