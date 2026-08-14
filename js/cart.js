/* ===== Cart Module — localStorage + WhatsApp ===== */

const CART_KEY = "para_lamsa_cart";
const WHATSAPP_NUMBER = "212660137363";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  showAddAnimation(productId);
  openCart();
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    saveCart(cart.filter(i => i.id !== productId));
  } else {
    saveCart(cart);
  }
  renderCart();
}

function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  const count = getCartCount();
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
    if (count > 0) {
      badge.classList.remove("pulse");
      void badge.offsetWidth;
      badge.classList.add("pulse");
    }
  }
}

function showAddAnimation(productId) {
  const btn = document.querySelector(`[data-product-id="${productId}"]`);
  if (!btn) return;
  btn.classList.add("added");
  setTimeout(() => btn.classList.remove("added"), 600);
  const cartIcon = document.querySelector(".cart-toggle");
  if (cartIcon) {
    cartIcon.classList.add("bounce");
    setTimeout(() => cartIcon.classList.remove("bounce"), 700);
  }
}

function renderCart() {
  const overlay = document.getElementById("cart-overlay");
  const panel = document.getElementById("cart-panel");
  if (!overlay || !panel) return;
  const cart = getCart();
  const itemsContainer = panel.querySelector(".cart-items");
  const totalEl = panel.querySelector(".cart-total-price");
  const emptyEl = panel.querySelector(".cart-empty");
  const footerEl = panel.querySelector(".cart-footer");
  if (cart.length === 0) {
    itemsContainer.innerHTML = "";
    emptyEl.style.display = "block";
    footerEl.style.display = "none";
    return;
  }
  emptyEl.style.display = "none";
  footerEl.style.display = "block";
  itemsContainer.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return "";
    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <p class="cart-item-price">${product.price} DH</p>
          <div class="cart-item-qty">
            <button onclick="updateQty(${product.id}, -1)" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${product.id}, 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${product.id})" aria-label="Remove item">&times;</button>
      </div>`;
  }).join("");
  totalEl.textContent = getCartTotal() + " DH";
}

function openCart() {
  renderCart();
  document.getElementById("cart-overlay")?.classList.add("active");
  document.getElementById("cart-panel")?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cart-overlay")?.classList.remove("active");
  document.getElementById("cart-panel")?.classList.remove("open");
  document.body.style.overflow = "";
}

function orderViaWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) return;
  let lines = ["Bonjour, je souhaite passer commande :", ""];
  cart.forEach(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (p) lines.push(`- ${p.name} (x${item.qty}) — ${p.price * item.qty} DH`);
  });
  lines.push("");
  lines.push(`Total : ${getCartTotal()} DH`);
  lines.push("");
  lines.push("Merci !");
  const msg = encodeURIComponent(lines.join("\n"));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  const toggle = document.querySelector(".cart-toggle");
  const overlay = document.getElementById("cart-overlay");
  const closeBtn = document.querySelector(".cart-close");
  if (toggle) toggle.addEventListener("click", openCart);
  if (overlay) overlay.addEventListener("click", closeCart);
  if (closeBtn) closeBtn.addEventListener("click", closeCart);
  // Event delegation for add-to-cart buttons (works even if buttons are added later)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-product-id]");
    if (btn) {
      addToCart(parseInt(btn.dataset.productId));
    }
  });
  renderCart();
});
