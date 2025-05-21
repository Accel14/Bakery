

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



// Загрузка продуктов
function loadProducts(categoryId, sortBy = 'name', order = 'asc') {
  const cart = getCart();
  window.scrollTo(0, 0);
  currentCategory = categoryId;
  const url = `http://localhost:3000/api/products?category_id=${categoryId}&sort_by=${sortBy}&order=${order}`;
  fetch(url)
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('product-list');
      container.innerHTML = '';
      products.forEach(product => {
        const el = createProductCard(product, cart);
        container.appendChild(el);
      });
      document.querySelectorAll('.to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const productId = parseInt(btn.dataset.id);
          addToCart(productId);
          updateProductCount(productId);
        });
      });

      document.querySelectorAll('.from-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const productId = parseInt(btn.dataset.id);
          removeFromCart(productId);
          updateProductCount(productId);
        });
      });
    });


}


