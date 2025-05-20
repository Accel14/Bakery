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
      document.getElementById('product-tools').style.display = 'inline-flex';
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

function toggleDropdown() {
  const dropdown = document.getElementById("myDropdown");
  dropdown.classList.toggle("show");

  // Закрытие при клике вне dropdown
  if (dropdown.classList.contains("show")) {
    document.addEventListener('click', closeDropdownOutside, true);
  } else {
    document.removeEventListener('click', closeDropdownOutside, true);
  }
}

function closeDropdownOutside(event) {
  const dropdown = document.getElementById("myDropdown");
  const dropbtn = document.querySelector(".dropbtn");

  if (!dropdown.contains(event.target) && !dropbtn.contains(event.target)) {
    dropdown.classList.remove("show");
    document.removeEventListener('click', closeDropdownOutside, true);
  }
}

// Обработчики для пунктов меню
document.querySelectorAll('#myDropdown a').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    const [sortBy, order] = this.getAttribute('value').split('-');
    loadProducts(currentCategory, sortBy, order);
    document.getElementById('myDropdown').classList.remove('show');
  });
});

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || {};

  // Увеличиваем количество, если товар уже в корзине
  cart[productId] = (cart[productId] || 0) + 1;

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Товар добавлен в корзину!');
}

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
              <a class="button to-cart-btn">В корзину</a>
            </div>
          `;
        // Навешиваем обработчик на кнопку
        const btn = el.querySelector('.to-cart-btn');
        btn.addEventListener('click', () => addToCart(product.id));
        container.appendChild(el);
      });
    });
}

