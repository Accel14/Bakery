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
      document.getElementById('product-tools').style.display = 'inline';
      document.getElementById('sort-dropdown').style.opacity = '1';
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
            <div class="product-image-wrapper" style="background-image: url('img/paper.png')"">
              <img src="food/${product.image_path}" class="food-image" alt="${product.name}">
            </div>
            <div class="product-info">
              <h3>${product.name}</h3>
              <div class="food-info">
                <p>${product.mass} грамм</p>
                <strong>${product.price} руб.</strong>
              </div>
              <a href="products.html" class="button">В корзину</a>
            </div>
          `;
        container.appendChild(el);
      });
    });
}

// Показываем/прячем меню сортировки
document.getElementById('sortToggle').addEventListener('click', () => {
  const menu = document.getElementById('sort-select');  
  menu.style.visibility = (menu.style.visibility === 'visible') ? 'hidden' : 'visible';
});

document.getElementById('sort-select').addEventListener('change', function () {
  const [sortBy, order] = this.value.split('-');
  loadProducts(currentCategory, sortBy, order);
});

// Закрытие меню, если клик вне
document.addEventListener('click', (e) => {
  if (!document.querySelector('.sort-dropdown').contains(e.target)) {
    document.getElementById('sort-select').style.visibility = 'hidden';
  }
});

