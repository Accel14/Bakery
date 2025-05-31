document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});

function removeFromCartOrder (productId) {
  removeFromCart(productId);

  loadCart();
}

function loadCart() {
  let totalCost = 0;
  let totalMass = 0;
  let totalCount = 0;

  const cart = getCart();
  if (Object.keys(cart).length > 0) {
    document.getElementById('empty-cart')?.remove();
  }

  const productIds = Object.keys(cart).map(Number);
  const url = `http://localhost:3000/cart?productIds=${productIds}`;

  fetch(url)
    .then(res => res.json())
    .then(goods => {
      const container = document.getElementById('order-list');
      container.innerHTML = '';

      goods.forEach(product => {
        const count = cart[product.id];
        const totals = renderCartItem(product, count);
        totalCost += totals.cost;
        totalMass += totals.mass;
        totalCount += totals.count;
      });

      renderCartTotal(totalCost, totalMass, totalCount);
    });
}

function renderCartItem(product, count) {
  const container = document.getElementById('order-list');

  const el = document.createElement('div');
  el.classList.add('order');
  el.id = "order_" + product.id;

  el.innerHTML = `
  <img src="food/${product.image_path}" class="food-image" alt="${product.name}">
  <h3>${product.name}</h3>
  <p>${product.mass} гр.</p>
  <div class="count">
    <p id="count_${product.id}">${count} шт.</p>
    <img class="remove-icon" alt="Удалить" src="img/remove.png">
  </div>
  <strong>${product.price} руб.</strong> 
  `;

  el.querySelector('.remove-icon').addEventListener('click', () => removeFromCartOrder(product.id));
  container.appendChild(el);

  return {
    cost: parseFloat(product.price) * count,
    mass: parseFloat(product.mass) * count,
    count: count
  };
}



function renderCartTotal(totalCost, totalMass, totalCount) {
  const container = document.getElementById('order-list');

  const total = document.createElement('div');
  total.classList.add('order');
  total.id = 'total-order';
  total.style.backgroundColor = 'rgb(41, 32, 18)';
  total.style.borderRadius = '10px';
  total.innerHTML = `
    <div></div>
    <h3 style="font-size: 24px;">Итого</h3>
    <p  style="font-size: 20px;" id="total-mass">${totalMass} гр.</p>
    <div class="count">
      <p style="font-size: 24px;" id="total-products">${totalCount} шт.</p>
    </div>
    <strong style="font-size: 24px;" id="total-price">${totalCost} руб.</strong>
  `;
  container.appendChild(total);
}