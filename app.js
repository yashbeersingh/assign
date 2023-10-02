// app.js
const express = require('express');
const helmet = require('helmet');
const { logger, expressLogger } = require('./logger');
const monitor = require('./monitor');

const app = express();

// Use helmet for additional security headers
app.use(helmet());

// Log HTTP requests
app.use(expressLogger);

// Sample authentication middleware
const authenticateUser = (req, res, next) => {
  // Simulate user authentication
  const isAuthenticated = Math.random() < 0.5; // 50% chance of being authenticated

  if (isAuthenticated) {
    logger.info('User authenticated successfully');
    next();
  } else {
    logger.warn('Authentication failed');
    res.status(401).send('Authentication failed');
  }
};

// Sample route requiring authentication
app.get('/secure-route', authenticateUser, (req, res) => {
  logger.info('Accessed secure route');
  res.send('Welcome to the secure route!');
});

// Sample activity route
app.get('/activity', authenticateUser, (req, res) => {
  logger.info('Performed some activity');
  res.send('Activity recorded!');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Application server running on port ${PORT}`);
});
