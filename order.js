


document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});







function loadCart() {

  const cart = JSON.parse(localStorage.getItem('cart')) || {};

  const productIds = Object.keys(cart).map(Number); // [123, 456, 789]
  const url = `http://localhost:3000/cart?productIds=${productIds}`;
  fetch(url)
    .then(res => res.json())
    .then(goods => {
      const container = document.getElementById('order-list');
      container.innerHTML = '';
      goods.forEach(product => {
        const el = document.createElement('div');
        el.classList.add('order');
        el.innerHTML = `
            <div class="product-image-wrapper" style="background-image: url('img/paper.png')"">
              <img src="food/${product.image_path}" class="food-image" alt="${product.name}">
            </div>
            <div class="">
              <h3>${product.name}</h3>
              <div class="">
                <p>${product.mass} грамм</p>
                <p>${cart[product.id]} штук</p>
                <strong>${product.price} руб.</strong>
              </div>
              <a class="">В корзину</a>
            </div>
          `;
        container.appendChild(el);
      });
    });
}