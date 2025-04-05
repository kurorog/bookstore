const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, 'bookstore.db'));

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password_hash TEXT,
    name TEXT,
    country TEXT,
    city TEXT,
    age INTEGER,
    avatar_url TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    genre TEXT,
    description TEXT,
    price REAL,
    rating REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cart_items (
    cart_id INTEGER,
    book_id INTEGER,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY(cart_id, book_id),
    FOREIGN KEY(cart_id) REFERENCES carts(id),
    FOREIGN KEY(book_id) REFERENCES books(id)
  )`);

  // Add sample books if none exist
  db.get('SELECT COUNT(*) as count FROM books', (err, row) => {
    if (row.count === 0) {
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
    }
  });
});

// Books endpoints
app.get('/api/books', (req, res) => {
  db.all('SELECT * FROM books', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    // Force proper JSON formatting
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows));
  });
});

app.get('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  db.get('SELECT * FROM books WHERE id = ?', [bookId], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(row);
  });
});

// Reviews endpoints
app.get('/api/reviews', (req, res) => {
  db.all('SELECT * FROM reviews', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/reviews', (req, res) => {
  const { bookId, rating, text, userId } = req.body;
  db.run(
    'INSERT INTO reviews (book_id, rating, text, user_id) VALUES (?, ?, ?, ?)',
    [bookId, rating, text, userId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Cart endpoints
app.get('/api/cart', (req, res) => {
  const userId = req.query.userId;
  db.all(
    `SELECT books.*, cart_items.quantity 
     FROM cart_items
     JOIN books ON cart_items.book_id = books.id
     JOIN carts ON cart_items.cart_id = carts.id
     WHERE carts.user_id = ? AND carts.is_active = 1`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

app.post('/api/cart', (req, res) => {
  const { userId, bookId } = req.body;
  db.run(
    'INSERT INTO cart_items (cart_id, book_id) VALUES ((SELECT id FROM carts WHERE user_id = ? AND is_active = 1), ?)',
    [userId, bookId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID });
    }
  );
});

// User endpoints
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(401).json({ error: 'User not found' });
    }
    // In a real application, you would verify the password hash here
    res.json(row);
  });
});

app.put('/api/profile', (req, res) => {
  const { id, name, email, country, city, age, password } = req.body;
  db.run(
    'UPDATE users SET name = ?, email = ?, country = ?, city = ?, age = ? WHERE id = ?',
    [name, email, country, city, age, id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true });
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
