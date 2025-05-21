const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Настройка EJS (исправь опечатку: 'view-engine' → 'view engine')
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());
app.use(express.static('.')); // Корень проекта (если CSS в корне)
app.use('/js', express.static('js')); // Для JS-файлов
app.use('/img', express.static('img')); // Для изображений

// Подключение к БД (оставляем как есть)
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

// Этот маршрут возвращает JSON (для fetch)
app.get('/api/products', (req, res) => {
  const categoryId = req.query.category_id;
  const sortBy = req.query.sort_by || 'name';    
  const order = req.query.order === 'desc' ? 'DESC' : 'ASC';

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


// ========== Новые маршруты для страниц ==========
app.get('/', (req, res) => {
  res.render('index'); // Рендерим views/index.ejs
});

app.get('/products', (req, res) => {
  res.render('products'); // Рендерим views/index.ejs
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/order', (req, res) => {
  res.render('order'); // Рендерит views/products.ejs
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});