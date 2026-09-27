/* ==========================================================================
   MENU DATA & STATE MANAGEMENT
   ========================================================================== */
const menuData = [
  {
    id: 1,
    name: "Classic Espresso",
    category: "coffee",
    price: 3500,
    tag: "Popular",
    desc: "Rich, concentrated shot of our signature roasted mountain arabica beans.",
    img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Artisan Latte",
    category: "coffee",
    price: 4500,
    tag: "Bestseller",
    desc: "Espresso with silky steamed fresh milk and beautiful hand-poured latte art.",
    img: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Spanish Cappuccino",
    category: "coffee",
    price: 4800,
    tag: "Sweet & Rich",
    desc: "Double espresso with condensed milk, velvety foam, and cinnamon dusting.",
    img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    name: "Cold Brew Citrus",
    category: "cold",
    price: 5000,
    tag: "Refreshing",
    desc: "16-hour slow steep cold brew with a subtle twist of fresh lemon peel.",
    img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    name: "Matcha Oat Latte",
    category: "cold",
    price: 5500,
    tag: "Healthy",
    desc: "Ceremonial grade Japanese green tea matcha layered with creamy oat milk.",
    img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    name: "French Butter Croissant",
    category: "bakery",
    price: 3800,
    tag: "Fresh Baked",
    desc: "Golden, flaky layered croissant baked fresh every morning with pure butter.",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 7,
    name: "Blueberry Almond Danish",
    category: "bakery",
    price: 4200,
    tag: "Chef Special",
    desc: "Crispy pastry topped with organic blueberries and toasted almond flakes.",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 8,
    name: "Avocado Egg Toast",
    category: "snacks",
    price: 6500,
    tag: "Breakfast",
    desc: "Sourdough toast topped with smashed avocado, poached egg, and chilli flakes.",
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80"
  }
];

let cart = [];

/* ==========================================================================
   DOM INITIALIZATION & LISTENERS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderMenu("all");
  setupNavigation();
  setupCartEvents();
  setupReservationForm();
  setDefaultReservationDate();
});

/* ==========================================================================
   RENDER MENU ITEMS
   ========================================================================== */
function renderMenu(category) {
  const menuGrid = document.getElementById("menuGrid");
  menuGrid.innerHTML = "";

  const filteredItems = category === "all" 
    ? menuData 
    : menuData.filter(item => item.category === category);

  filteredItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML = `
      <div class="card-img-box">
        <img src="${item.img}" alt="${item.name}">
        <span class="card-tag">${item.tag}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer">
          <span class="card-price">${item.price.toLocaleString()} MMK</span>
          <button class="add-cart-btn" onclick="addToCart(${item.id})" aria-label="Add ${item.name} to cart">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

/* Menu Category Filtering */
const tabBtns = document.querySelectorAll(".tab-btn");
tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenu(btn.dataset.category);
  });
});

/* ==========================================================================
   SHOPPING CART LOGIC
   ========================================================================== */
function addToCart(itemId) {
  const item = menuData.find(m => m.id === itemId);
  const existingItem = cart.find(c => c.id === itemId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  showToast(`Added ${item.name} to your cart!`);
}

function addComboToCart() {
  const comboItem = {
    id: 99,
    name: "Morning Combo Special",
    price: 6000,
    img: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=500&q=80"
  };

  const existingCombo = cart.find(c => c.id === comboItem.id);
  if (existingCombo) {
    existingCombo.qty += 1;
  } else {
    cart.push({ ...comboItem, qty: 1 });
  }

  updateCartUI();
  showToast("Morning Combo added to your cart!");
}

function updateCartQty(itemId, delta) {
  const itemIndex = cart.findIndex(c => c.id === itemId);
  if (itemIndex > -1) {
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  updateCartUI();
}

function updateCartUI() {
  const cartBadge = document.getElementById("cartBadge");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartTotal = document.getElementById("cartTotal");

  // Total quantity calculation
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalCount;

  // Render items in cart drawer
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Your coffee cart is empty.</p>`;
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${(item.price * item.qty).toLocaleString()} MMK</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  // Grand total calculation
  const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartTotal.textContent = `${grandTotal.toLocaleString()} MMK`;
}

function checkoutOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before checking out!");
    return;
  }
  
  const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  alert(`Thank you for your order! Total Amount: ${grandTotal.toLocaleString()} MMK.\n\nYour order has been sent to the barista!`);
  cart = [];
  updateCartUI();
  toggleCart(false);
}

/* Drawer open/close functions */
function setupCartEvents() {
  const cartToggle = document.getElementById("cartToggle");
  const closeCart = document.getElementById("closeCart");
  const cartOverlay = document.getElementById("cartOverlay");

  cartToggle.addEventListener("click", () => toggleCart(true));
  closeCart.addEventListener("click", () => toggleCart(false));
  cartOverlay.addEventListener("click", () => toggleCart(false));
}

function toggleCart(open) {
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  
  if (open) {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
  } else {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
  }
}

/* ==========================================================================
   NAVIGATION & SCROLL EFFECTS
   ========================================================================== */
function setupNavigation() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  // Header background switch on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close mobile menu on click
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

/* ==========================================================================
   RESERVATION FORM & TOAST UTILS
   ========================================================================== */
function setDefaultReservationDate() {
  const resDateInput = document.getElementById("resDate");
  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.value = today;
    resDateInput.min = today;
  }
}

function setupReservationForm() {
  const resForm = document.getElementById("reservationForm");
  resForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("resName").value;
    const guests = document.getElementById("resGuests").value;
    const date = document.getElementById("resDate").value;
    const time = document.getElementById("resTime").value;

    alert(`Reservation Confirmed!\n\nName: ${name}\nGuests: ${guests}\nDate: ${date}\nTime: ${time}\n\nWe look forward to hosting you at Aroma & Artisan!`);
    resForm.reset();
    setDefaultReservationDate();
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
