const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Helloitsmysql@2249', 
  database: 'UMS'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL DB');
});

// Register endpoint
app.post('/register', (req, res) => {
  const { username, email, password, role } = req.body;
  console.log('Register attempt:', email);

  if (!username || !email || !password || !role) {
    return res.status(400).send({ success: false, message: 'Missing fields' });
  }

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Hashing error:', err);
      return res.status(500).send({ success: false, message: 'Server error' });
    }

    db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send({ success: false, message: 'Email already registered' });
          }
          return res.status(500).send({ success: false, message: 'Database error' });
        }
        res.send({ success: true, message: 'Registered successfully' });
      }
    );
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  if (!email || !password) {
    return res.status(400).send({ success: false, message: 'Missing email or password' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Select error:', err);
      return res.status(500).send({ success: false, message: 'Server error' });
    }
    if (results.length === 0) {
      return res.send({ success: false, message: 'Invalid credentials' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Compare error:', err);
        return res.status(500).send({ success: false, message: 'Server error' });
      }
      if (!isMatch) {
        return res.send({ success: false, message: 'Invalid credentials' });
      }

      const now = new Date();
      db.query(
        'UPDATE users SET is_online = ?, last_login = ? WHERE id = ?',
        [true, now, user.id],
        (updateErr) => {
          if (updateErr) {
            console.error('Update error:', updateErr);
            return res.status(500).send({ success: false, message: 'Server error' });
          }
          res.send({ success: true, redirect: '/home.html' });
        }
      );
    });
  });
});

// Get users for dashboard
app.get('/home', (_, res) => {
  db.query('SELECT id, username, email, role, last_login, is_online FROM users', (err, results) => {
    if (err) {
      console.error('Get users error:', err);
      return res.status(500).send('Error loading users');
    }
    res.json({ users: results });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

