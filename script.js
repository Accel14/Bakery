document.getElementById('menuToggle').addEventListener('click', function () {
  const menu = document.getElementById('menu');
  menu.classList.toggle('open');
  if (document.getElementById('menuToggle').src == "img/menu.png") {
    document.getElementById('menuToggle').src = "img/menu_close.png";
  } else {
    document.getElementById('menuToggle').src = "img/menu.png";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const categoryCards = document.getElementById('category-cards');
  const categoryButtons = document.getElementById('category-buttons');
  const productList = document.getElementById('product-list');

  // При клике на большие баннеры
  document.querySelectorAll('.category-banner').forEach(card => {
    card.addEventListener('click', () => {
      const categoryId = card.dataset.id;
      categoryCards.style.display = 'none';
      categoryButtons.style.display = 'flex';
      loadProducts(categoryId);
    });
  });

  // При клике на маленькие кнопки
  document.querySelectorAll('.category-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const categoryId = btn.dataset.id;
      loadProducts(categoryId);
    });
  });
});

let currentCategory = null;
document.getElementById('sort-select').addEventListener('change', function () {
  const [sortBy, order] = this.value.split('-');
  loadProducts(currentCategory, sortBy, order);
});

// Загрузка продуктов
function loadProducts(categoryId, sortBy = 'name', order = 'asc') {
  currentCategory = categoryId;
  const url = `http://localhost:3000/products?category_id=${categoryId}&sort_by=${sortBy}&order=${order}`;
  fetch(url)
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('product-list');
      container.innerHTML = '';
      products.forEach(product => {
        const el = document.createElement('div');
        el.classList.add('product-card');

        el.innerHTML = `
            <div class="product-image-wrapper" style="background-image: url('img/board_t.png')"">
              <img src="food/${product.image_path}" class="food-image" alt="${product.name}">
            </div>
            <div class="product-info">
              <h3>${product.name}</h3>
              <p>${product.mass} грамм</p>
              <strong>${product.price} руб.</strong>
            </div>
          `;
        container.appendChild(el);
      });
    });
}
