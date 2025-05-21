function createProductCard(product, cart) {
  const el = document.createElement('div');
  el.classList.add('product-card');

  el.innerHTML = `
    <div class="product-image-wrapper" style="background-image: url('img/paper.png')">
      <img src="food/${product.image_path}" class="food-image" alt="${product.name}">
    </div>
    <div class="product-info">
      <h3>${product.name}</h3>
      <div class="food-info">
        <p>${product.mass} грамм</p>
        <strong>${product.price} руб.</strong>
      </div>
      <a href="#" class="button from-cart-btn" data-id="${product.id}">Убрать из корзины</a>
      <div>
        <a href="#" class="button to-cart-btn" data-id="${product.id}" style="position: relative;">
          В корзину
          <div id="product-count-${product.id}" class="product-count" style="
            position: absolute; top:-2px; right:-2px;
            background-color: rgb(27, 21, 12); border-color: white;
            font-size: 20px; border-radius: 20px;
            text-align: center; justify-content: center;
            color: rgb(200, 164, 91); width: 20px; height: 20px; padding: 3px">
            ${cart[product.id] || ''}
          </div>
        </a>
      </div>
    </div>
  `;    

  return el;
}

function updateProductCount(productId) {
  const cart = getCart();
  const count = cart[productId] || '';
  const el = document.getElementById(`product-count-${productId}`);
  if (el) {
    el.textContent = count;
  }
}   
