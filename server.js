// server.js
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

// Database setup
const db = new sqlite3.Database(':memory:');

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      genre TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      rating REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      country TEXT,
      city TEXT,
      age INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (book_id) REFERENCES books(id)
    )
  `);

  // Insert sample data
  const books = [
    ['1984', 'Джордж Оруэлл', 'Антиутопия', 'Классика антиутопии', 350, 4.5],
    ['Мастер и Маргарита', 'Михаил Булгаков', 'Роман', 'Мистический роман', 420, 5],
    ['Преступление и наказание', 'Фёдор Достоевский', 'Роман', 'Психологический роман', 380, 4.7],
    ['Гарри Поттер и философский камень', 'Дж. К. Роулинг', 'Фэнтези', 'Первая книга серии', 500, 4.8],
    ['Война и мир', 'Лев Толстой', 'Роман', 'Эпический роман', 450, 4.6]
  ];

  const stmt = db.prepare('INSERT INTO books (title, author, genre, description, price, rating) VALUES (?, ?, ?, ?, ?, ?)');
  books.forEach(book => stmt.run(book));
  stmt.finalize();

  // Sample user
  db.run(
    'INSERT INTO users (email, password, name, country, city, age) VALUES (?, ?, ?, ?, ?, ?)',
    ['user@example.com', 'password', 'Тестовый пользователь', 'Россия', 'Москва', 30]
  );
});

// API endpoints
app.get('/api/books', (req, res) => {
  db.all('SELECT * FROM books', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err || !row) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    res.json(row);
  });
});

app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;
  db.run(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, password, name],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, email, name });
    }
  );
});

app.get('/api/cart', (req, res) => {
  const { userId } = req.query;
  db.all(
    `SELECT b.id, b.title, b.author, b.price, c.quantity 
     FROM cart c
     JOIN books b ON c.book_id = b.id
     WHERE c.user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

app.post('/api/cart', (req, res) => {
  const { userId, bookId } = req.body;
  db.run(
    `INSERT INTO cart (user_id, book_id, quantity) 
     VALUES (?, ?, 1)
     ON CONFLICT(user_id, book_id) 
     DO UPDATE SET quantity = quantity + 1`,
    [userId, bookId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    }
  );
});

app.delete('/api/cart/:bookId', (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.query;
  db.run(
    'DELETE FROM cart WHERE user_id = ? AND book_id = ?',
    [userId, bookId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    }
  );
});

app.post('/api/checkout', (req, res) => {
  const { userId } = req.body;
  db.run(
    'DELETE FROM cart WHERE user_id = ?',
    [userId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    }
  );
});

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});