const express = require('express');
const session = require('express-session');

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Middleware for session management
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Sample user data (In a real application, you would use a database)
const users = [
  { id: 1, username: 'admin', password: 'admin' },
  { id: 2, username: 'user', password: 'user' }
];

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.userId = user.id;
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected endpoint
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.json({ message: 'Welcome to the dashboard!' });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
