const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const compression = require('compression'); // Импорт compression

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());
app.use(express.static('.')); 
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));
app.use(compression()); // Использование compression

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

app.get('/api/products', (req, res) => {
  const categoryId = req.query.category_id;
  const sortBy = req.query.sort_by || 'name';    
  const order = req.query.order === 'desc' ? 'DESC' : 'ASC';

  const allowedFields = ['name', 'mass', 'price'];
  if (!allowedFields.includes(sortBy)) {
    return res.status(400).json({ error: 'Неизвестный параметр сортировки' });
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


// Маршруты для рендера страниц
app.get('/', (req, res) => {
  res.render('index', { activePage: 'home' });
});

app.get('/products', (req, res) => {
  res.render('products', { activePage: 'products' });
});

app.get('/order', (req, res) => {
  res.render('order', { activePage: 'order' });
});

app.get('/about', (req, res) => {
  res.render('about', { activePage: 'about' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});