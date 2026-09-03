// ========================================
// LOGIGAMER 2.0 — SCRIPT
// ========================================

// ========================================
// ELEMENTS
// ========================================

const catalogBtn = document.getElementById("catalogBtn");
const catalogMenu = document.getElementById("catalogMenu");

const searchInput = document.getElementById("searchInput");

const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal"); // Синхронізовано з HTML (#cartModal)
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotalPrice = document.getElementById("cartTotalPrice"); // Синхронізовано з HTML (#cartTotalPrice)
const checkoutBtn = document.getElementById("checkoutBtn");


// ========================================
// CATALOG MENU
// ========================================

if (catalogBtn && catalogMenu) {
    catalogBtn.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        catalogMenu.classList.toggle("active");
    });

    document.addEventListener("click", function(event) {
        if (!event.target.closest(".catalog-wrapper")) {
            catalogMenu.classList.remove("active");
        }
    });

    catalogMenu.querySelectorAll("a").forEach(function(link) {
        link.addEventListener("click", function() {
            catalogMenu.classList.remove("active");
        });
    });
}


// ========================================
// SEARCH
// ========================================

const cards = document.querySelectorAll(".card");

if (searchInput) {
    searchInput.addEventListener("input", function() {
        const search = this.value.toLowerCase().trim();

        cards.forEach(card => {
            const name = (card.dataset.name || "").toLowerCase();

            if (name.includes(search)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
}


// ========================================
// CART DATA
// ========================================

let cart = JSON.parse(localStorage.getItem("logigamerCart")) || [];


// ========================================
// SAVE CART
// ========================================

function saveCart() {
    localStorage.setItem("logigamerCart", JSON.stringify(cart));
}


// ========================================
// HTML SECURITY
// ========================================

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


// ========================================
// UPDATE CART
// ========================================

function updateCart() {
    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart" style="text-align: center; color: #888; padding: 20px 0;">
                🛒 Кошик порожній
            </p>
        `;
        if (cartTotalPrice) cartTotalPrice.textContent = "0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const element = document.createElement("div");
        element.className = "cart-item";
        element.style.display = "flex";
        element.style.justifyContent = "space-between";
        element.style.alignItems = "center";
        element.style.marginBottom = "12px";

        element.innerHTML = `
            <div class="cart-item-info">
                <h4 style="margin: 0;">${escapeHTML(item.name)}</h4>
                <p style="margin: 4px 0 0; color: #28a745;">${item.price} ₴</p>
            </div>
            <button class="remove-item" data-index="${index}" type="button" style="background:none; border:none; color:#ff4d4d; font-size:18px; cursor:pointer;">
                ✕
            </button>
        `;

        cartItems.appendChild(element);
    });

    if (cartTotalPrice) {
        cartTotalPrice.textContent = total;
    }

    // Видалення товару
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function() {
            const index = Number(this.dataset.index);
            cart.splice(index, 1);
            saveCart();
            updateCart();
        });
    });
}


// ========================================
// ADD TO CART
// ========================================

document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", function() {
        const name = this.dataset.name;
        const price = Number(this.dataset.price);

        const existing = cart.find(item => item.name === name);

        if (existing) {
            alert("Ця гра вже є у кошику!");
            return;
        }

        cart.push({ name: name, price: price });

        saveCart();
        updateCart();

        const oldText = this.textContent;
        this.textContent = "✓ Додано!";
        this.style.background = "#28a745";

        setTimeout(() => {
            this.textContent = oldText;
            this.style.background = "";
        }, 1200);
    });
});


// ========================================
// OPEN / CLOSE CART MODAL
// ========================================

if (cartBtn && cartModal) {
    cartBtn.addEventListener("click", function() {
        cartModal.classList.add("active");
        document.body.style.overflow = "hidden";
    });
}

function closeCartWindow() {
    if (!cartModal) return;
    cartModal.classList.remove("active");
    document.body.style.overflow = "";
}

if (closeCart) {
    closeCart.addEventListener("click", closeCartWindow);
}

if (cartModal) {
    cartModal.addEventListener("click", function(event) {
        if (event.target === cartModal) {
            closeCartWindow();
        }
    });
}


// ========================================
// KEYBOARD CONTROLS (ESC)
// ========================================

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        if (catalogMenu) catalogMenu.classList.remove("active");
        if (cartModal && cartModal.classList.contains("active")) {
            closeCartWindow();
        }
    }
});


// ========================================
// CHECKOUT
// ========================================

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
        if (cart.length === 0) {
            alert("Ваш кошик порожній!");
            return;
        }

        let total = cart.reduce((sum, item) => sum + item.price, 0);

        alert(
            "Дякуємо за замовлення! 🎮\n\n" +
            "Кількість ігор: " + cart.length + "\n" +
            "Сума до сплати: " + total + " ₴\n\n" +
            "Це демонстраційна версія LogiGamer 2.0."
        );

        cart = [];
        saveCart();
        updateCart();
        closeCartWindow();
    });
}


// ========================================
// HERO BUTTON SCROLL
// ========================================

const letsGo = document.getElementById("letsGo");

if (letsGo) {
    letsGo.addEventListener("click", function() {
        const gamesSection = document.getElementById("games");
        if (gamesSection) {
            gamesSection.scrollIntoView({ behavior: "smooth" });
        }
    });
}


// ========================================
// DARK THEME TOGGLE
// ========================================

const themeBtn = document.createElement("button");
themeBtn.textContent = "🌙";
themeBtn.title = "Змінити тему";
themeBtn.setAttribute("aria-label", "Змінити тему");

Object.assign(themeBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    border: "none",
    borderRadius: "50%",
    background: "#111",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    zIndex: "1500",
    boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
});

document.body.appendChild(themeBtn);

const savedTheme = localStorage.getItem("logigamerTheme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("logigamerTheme", isDark ? "dark" : "light");
});


// ========================================
// GAME SNOWFLAKES ANIMATION
// ========================================

function createSnowflake() {
    const flake = document.createElement("div");
    flake.textContent = "🎮";

    Object.assign(flake.style, {
        position: "fixed",
        top: "-20px",
        left: Math.random() * window.innerWidth + "px",
        fontSize: (Math.random() * 15 + 10) + "px",
        opacity: Math.random(),
        pointerEvents: "none",
        zIndex: "1",
        transition: "transform 4s linear, opacity 4s linear"
    });

    document.body.appendChild(flake);

    setTimeout(() => {
        flake.style.transform = `translateY(${window.innerHeight + 50}px) rotate(360deg)`;
        flake.style.opacity = "0";
    }, 50);

    setTimeout(() => {
        flake.remove();
    }, 4000);
}

setInterval(createSnowflake, 400);


// ========================================
// INITIALIZE
// ========================================

updateCart();
