const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: __dirname + '/../logs/debug.log', json: false })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: __dirname + '/../logs/exceptions.log', json: false })
    ],
    exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;