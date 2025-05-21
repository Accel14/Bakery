const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

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

app.get('/categories', (req, res) => {
  db.query('SELECT id, name FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/cart', (req, res) => {
  const productIds = req.query.productIds;

  if (!productIds) {
    return res.status(400).json({ error: 'Отсутствуют ID продуктов в параметрах запроса' });
  }


  const idsArray = productIds.split(',').map(id => parseInt(id.trim()));

  if (idsArray.some(isNaN)) {
    return res.status(400).json({ error: 'Неверный формат ID продукта' });
  }

  if (idsArray.length === 0) {
    return res.json([]);
  }

  const placeholders = idsArray.map(() => '?').join(',');
  const query = `
      SELECT id, name, mass, price, image_path
      FROM products
      WHERE id IN (${placeholders})
    `;

  db.query(query, idsArray, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Получение продуктов по категории
app.get('/products', (req, res) => {
  const categoryId = req.query.category_id;
  const sortBy = req.query.sort_by || 'name';     // По умолчанию сортировка по названию
  const order = req.query.order === 'desc' ? 'DESC' : 'ASC'; // ASC по умолчанию

  const allowedFields = ['name', 'mass', 'price'];
  if (!allowedFields.includes(sortBy)) {
    return res.status(400).json({ error: 'Invalid sort field' });
  }

  const query = `
    SELECT id, name, mass, price, image_path
    FROM products
    WHERE category_id = ?
    ORDER BY ${mysql.escapeId(sortBy)} ${order}
  `;
  db.query(query, [categoryId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
