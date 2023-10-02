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
// Sample authentication middleware with blocking after 3 consecutive failures
let consecutiveFailures = new Map(); // Map to store consecutive failures
let blockedUsers = new Set(); // Set to store blocked users

const authenticateUser = (req, res, next) => {
  const userId = req.headers['user-id']; // Assuming user ID is provided in headers for demonstration

  // If the user is blocked, prevent further authentication attempts
  if (blockedUsers.has(userId)) {
    logger.warn(`User ${userId} is blocked. Further authentication attempts are not allowed.`);
    res.status(401).send('Authentication failed. User blocked.');
    return;
  }

  // If user not in the map, initialize with 0 failures
  if (!consecutiveFailures.has(userId)) {
    consecutiveFailures.set(userId, 0);
  }

  // Simulate user authentication
  const isAuthenticated = Math.random() < 0.5; // 50% chance of being authenticated

  if (isAuthenticated) {
    // Reset consecutive failures if authentication is successful
    consecutiveFailures.set(userId, 0);
    logger.info('User authenticated successfully');
    next();
  } else {
    const currentFailures = consecutiveFailures.get(userId);
    consecutiveFailures.set(userId, currentFailures + 1);

    logger.warn(`Authentication failed. Consecutive failures: ${currentFailures + 1}`);

    if (currentFailures >= 2) {
      // If 3 consecutive failures, block user and end session
      logger.warn(`User ${userId} blocked due to 3 consecutive failures. Ending session.`);
      blockedUsers.add(userId);
      res.status(401).send('Authentication failed. User blocked.');
      return;
    }

    res.status(401).send('Authentication failed');
  }
};

// Sample route requiring authentication
app.get('/secure-route', authenticateUser, (req, res) => {
  // Check if the user is blocked before allowing access to the secure route
  const userId = req.headers['user-id'];
  if (blockedUsers.has(userId)) {
    logger.warn(`User ${userId} attempted to access the secure route but is blocked.`);
    res.status(401).send('Access denied. User blocked.');
  } else {
    logger.info('Accessed secure route');
    res.send('Welcome to the secure route!');
  }
});

// Sample activity route
app.get('/activity', authenticateUser, (req, res) => {
  // Check if the user is blocked before allowing activity
  const userId = req.headers['user-id'];
  if (blockedUsers.has(userId)) {
    logger.warn(`User ${userId} attempted to perform activity but is blocked.`);
    res.status(401).send('Activity denied. User blocked.');
  } else {
    logger.info('Performed some activity');
    res.send('Activity recorded!');
  }
});
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