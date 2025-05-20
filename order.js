


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
  if (Object.keys(cart).length > 0) { document.getElementById('empty-cart').remove();}
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
        el.id = "order_" + product.id;
        el.innerHTML = `
            <img src="food/${product.image_path}" class="food-image" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.mass} грамм</p>
            <div class="count" style="display: flex;">
              <p id="count_${product.id}" value=${cart[product.id]} >${cart[product.id]} шт.</p>
              <img onclick="removeFromCart(${product.id})" alt="Удалить" style="top: 0; width: 16px; height: 16px" src="img/remove.png"></img>
            </div>
            <strong>${product.price} руб.</strong>
          `;
        container.appendChild(el);
      });
    });
}