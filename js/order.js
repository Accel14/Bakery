document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});

function removeFromCartOrder(productId, categoryId) {
  removeFromCart(productId, categoryId);

  loadCart();
}

function loadCart() {
  let totalCost = 0;
  let totalMass = 0;
  let totalCount = 0;
  let totalVolume = 0;

  const container = document.getElementById('order-list');
  const orderButton = document.getElementById('order-button');
  const cart = getCart();
  if (Object.keys(cart).length > 0) {
    document.getElementById('empty-cart')?.remove();
    container.style.display = 'grid';
    orderButton.style.display = 'inline-block';
  }

  container.innerHTML = '';

  let categoryId = 1;

  const productIds = Object.keys(cart).map(Number);
  const url = `http://localhost:3000/cart?productIds=${productIds}`;

  fetch(url)
    .then(res => res.json())
    .then(goods => {
      const container = document.getElementById('order-list');
      container.innerHTML = '';

      goods.forEach(product => {
        const count = cart[product.id];
        if (cart[product.id]) {
          const totals = renderCartItem(product, count, categoryId);
          totalCost += totals.cost;
          if (categoryId === 3) { totalVolume += totals.mass; } else { totalMass += totals.mass; }
          totalCount += totals.count;
        }
      });

      let grammAndMass = { totalMass, totalVolume };
      renderCartTotal(totalCost, grammAndMass, totalCount);
    });
}

function renderCartItem(product, count, categoryId) {
  const container = document.getElementById('order-list');

  const el = document.createElement('div');

  const grammOrLiter = categoryId == 3 ? 'л.' : 'гр.';

  let mql = window.matchMedia("(max-width: 768px)");

  el.classList.add('order');
  el.id = "order_" + product.id;
  if (mql.matches) {
    el.innerHTML = `
  <div class="order-img-container">
    <img src="food/${product.image_path}" class="food-image" alt="${product.name}">
  </div>
  <div class="product-details">
  
    <h3>${product.name}</h3>

    <div class="info-row">
      <div style="min-width: 60px">
        <p>${product.mass} ${grammOrLiter}</p>
      </div>
      <div class="count">
        <p id="count_${product.id}">${count} шт.</p>
        <img class="remove-icon" alt="Удалить" src="img/remove.png">
      </div>
      <strong>${product.price * count} руб.</strong>
    </div>

  </div>
  `;
  } else {
    el.innerHTML = `
  <div class="order-img-container">
    <img src="food/${product.image_path}" class="food-image" alt="${product.name}">
  </div>
  <h3>${product.name}</h3>
  <p>${product.mass} ${grammOrLiter}</p>
  <div class="count">
    <p id="count_${product.id}">${count} шт.</p>
    <img class="remove-icon" alt="Удалить" src="img/remove.png">
  </div>
  <strong>${product.price * count} руб.</strong> 
  `;
  }


  el.querySelector('.remove-icon').addEventListener('click', () => removeFromCartOrder(product.id, categoryId));
  container.appendChild(el);

  return {
    cost: parseFloat(product.price) * count,
    mass: parseFloat(product.mass) * count,
    count: count
  };
}



function renderCartTotal(totalCost, grammAndMass, totalCount) {
  const container = document.getElementById('order-list');

  const total = document.createElement('div');
  total.classList.add('order');
  total.id = 'total-order';
  total.style.backgroundColor = 'rgb(41, 32, 18)';
  total.style.borderRadius = '10px';
  let litres = grammAndMass.totalVolume > 0 ? ', ' + grammAndMass.totalVolume + " л." : '';
  let mql = window.matchMedia("(max-width: 768px)");
  if (mql.matches) {
    total.innerHTML = `
    <div style="width: 60px;"></div>
    <div class="product-details">
  
    <h3>Итого</h3>

    <div class="info-row">
        <p>${grammAndMass.totalMass} гр. ${litres}</p>
      <div class="count">
        <p>${totalCount} шт.</p>
        <img class="remove-icon" alt="Удалить" src="img/remove.png">
      </div>
      <strong>${totalCost} руб.</strong>
    </div>

  </div>
  `;
  } else {
    total.innerHTML = `
    <div></div>
    <h3 style="font-size: 24px;">Итого</h3>
    <p  style="font-size: 18px;" id="total-mass">${grammAndMass.totalMass} гр. ${litres}</p>
    <div class="count">
      <p style="font-size: 24px;" id="total-products">${totalCount} шт.</p>
    </div>
    <strong style="font-size: 22px;" id="total-price">${totalCost} руб.</strong>
  `;
  }

  container.appendChild(total);
}