const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Соединение с БД
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bakery'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Получение всех категорий
app.get('/categories', (req, res) => {
  db.query('SELECT id, name FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Получение продуктов по категории
app.get('/products', (req, res) => {
  const categoryId = req.query.category_id;
  if (!categoryId) return res.status(400).json({ error: 'Missing category_id' });

  db.query(
    'SELECT name, mass, price, image_path FROM products WHERE category_id = ?',
    [categoryId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
