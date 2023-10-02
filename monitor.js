// monitor.js
const express = require('express');
const promBundle = require('express-prom-bundle');
const { logger } = require('./logger');

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  promClient: {
    collectDefaultMetrics: {},
  },
});

const app = express();
app.use(metricsMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Monitoring server running on port ${PORT}`);
});

module.exports = app;
