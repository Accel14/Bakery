


document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});






function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  //let newValue = parseInt(document.getElementById("count_" + productId).innerHTML.split(' ')[0]) - 1;
  // Уменьшаем количество, если товар уже в корзине
  cart[productId] = (cart[productId] || 0) - 1;
  let el = document.getElementById("count_" + productId);
  el.innerHTML = cart[productId] + " шт.";
  if (cart[productId] < 1) {
    document.getElementById("order_" + productId).remove();
    delete cart[productId];
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {

  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  if (Object.keys(cart).length > 0) { document.getElementById('empty-cart').remove(); }
  const productIds = Object.keys(cart).map(Number); // [123, 456, 789]
  const url = `http://localhost:3000/cart?productIds=${productIds}`;
  fetch(url)
    .then(res => res.json())
    .then(goods => {
      const container = document.getElementById('order-list');
      container.innerHTML = '';
      let totalCost = null;
      let totalMass = null;
      let totalCount = null;
      goods.forEach(product => {
        const el = document.createElement('div');
        totalCost += parseFloat(product.price);
        totalMass += parseFloat(product.mass);
        totalCount += parseFloat(cart[product.id]);
        el.classList.add('order');
        el.id = "order_" + product.id;
        el.innerHTML = `
          <img src="food/${product.image_path}" class="food-image" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.mass} гр.</p>
          <div class="count">
            <p id="count_${product.id}" value=${cart[product.id]}>${cart[product.id]} шт.</p>
            <img onclick="removeFromCart(${product.id})" alt="Удалить" class="remove-icon" src="img/remove.png">
          </div>
          <strong>${product.price} руб.</strong>
        `;

        container.appendChild(el);
      });

      const total = document.createElement('div');
      total.classList.add('order');
      total.id = 'total-order';
      total.innerHTML = `
          <div></div>
          <h3>Итого</h3>
          <p id="total-mass">${totalMass} гр.</p>
          <div class="count">
            <p id="total-products">${totalCount} шт.</p>
          </div>
          <strong id="total-price">${totalCost} руб.</strong>
        `;
      container.appendChild(total);
    });
}