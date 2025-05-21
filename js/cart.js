function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || {};
}

function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  setCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart();
  if (cart[productId]) {
    cart[productId]--;
    if (cart[productId] < 1) {
      delete cart[productId];
    }
    setCart(cart);
  }
}