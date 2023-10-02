// logger.js
const { createLogger, format, transports } = require('winston');
const expressWinston = require('express-winston');

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log', maxsize: 1000000, maxFiles: 5, level: 'info' }),
  ],
});

const expressLogger = expressWinston.logger({
  transports: [new transports.Console()],
  format: format.combine(format.timestamp(), format.json()),
  meta: false,
  msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
});

module.exports = { logger, expressLogger };
