// ========================================
// LOGIGAMER 2.0
// ========================================


// ========================================
// ELEMENTS
// ========================================

const catalogBtn = document.getElementById("catalogBtn");
const catalogMenu = document.getElementById("catalogMenu");

const searchInput = document.getElementById("searchInput");

const cartBtn = document.getElementById("cartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const checkout = document.getElementById("checkout");


// ========================================
// CATALOG
// ========================================

if (catalogBtn && catalogMenu) {

    catalogBtn.addEventListener("click", function(event) {

        event.stopPropagation();

        catalogMenu.classList.toggle("active");

    });


    document.addEventListener("click", function(event) {

        if (!event.target.closest(".catalog-wrapper")) {

            catalogMenu.classList.remove("active");

        }

    });


    // Закриваємо каталог після натискання
    // на будь-яке посилання
    catalogMenu.querySelectorAll("a").forEach(link => {

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

        const search = this.value
            .toLowerCase()
            .trim();


        cards.forEach(card => {

            const name =
                (card.dataset.name || "")
                .toLowerCase();


            if (name.includes(search)) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

}


// ========================================
// CART
// ========================================

let cart =
    JSON.parse(
        localStorage.getItem("logigamerCart")
    ) || [];


// ========================================
// SAVE CART
// ========================================

function saveCart() {

    localStorage.setItem(
        "logigamerCart",
        JSON.stringify(cart)
    );

}


// ========================================
// ADD TO CART
// ========================================

document
    .querySelectorAll(".add-cart")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const name =
                    this.dataset.name;


                const price =
                    Number(
                        this.dataset.price
                    );


                const existing =
                    cart.find(
                        item =>
                            item.name === name
                    );


                if (existing) {

                    alert(
                        "Ця гра вже є у кошику!"
                    );

                    return;

                }


                cart.push({

                    name: name,
                    price: price

                });


                saveCart();

                updateCart();


                const oldText =
                    this.textContent;


                this.textContent =
                    "✓ Додано!";


                this.style.background =
                    "#28a745";


                setTimeout(() => {

                    this.textContent =
                        oldText;

                    this.style.background =
                        "";

                }, 1200);

            }
        );

    });


// ========================================
// HTML SECURITY
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


// ========================================
// UPDATE CART
// ========================================

function updateCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <p class="empty-cart">
                🛒 Кошик порожній
            </p>

        `;

    }


    let total = 0;


    cart.forEach((item, index) => {

        total += item.price;


        const element =
            document.createElement("div");


        element.className =
            "cart-item";


        element.innerHTML = `

            <div class="cart-item-info">

                <h4>
                    ${escapeHTML(item.name)}
                </h4>

                <p>
                    ${item.price}₴
                </p>

            </div>


            <button
                class="remove-item"
                data-index="${index}"
                type="button"
            >
                ✕
            </button>

        `;


        cartItems.appendChild(element);

    });


    if (cartCount) {

        cartCount.textContent =
            cart.length;

    }


    if (cartTotal) {

        cartTotal.textContent =
            total + "₴";

    }


    document
        .querySelectorAll(".remove-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    cart.splice(
                        index,
                        1
                    );


                    saveCart();

                    updateCart();

                }
            );

        });

}


// ========================================
// OPEN CART
// ========================================

if (cartBtn && cartOverlay) {

    cartBtn.addEventListener(
        "click",
        function() {

            cartOverlay.classList.add(
                "active"
            );


            document.body.style.overflow =
                "hidden";

        }
    );

}


// ========================================
// CLOSE CART
// ========================================

function closeCartWindow() {

    if (!cartOverlay) {
        return;
    }


    cartOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


if (closeCart) {

    closeCart.addEventListener(
        "click",
        closeCartWindow
    );

}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                cartOverlay
            ) {

                closeCartWindow();

            }

        }
    );

}


// ========================================
// ESC
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {


            if (catalogMenu) {

                catalogMenu.classList.remove(
                    "active"
                );

            }


            if (
                cartOverlay &&
                cartOverlay.classList.contains(
                    "active"
                )
            ) {

                closeCartWindow();

            }

        }

    }
);


// ========================================
// CLEAR CART
// ========================================

if (clearCart) {

    clearCart.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                return;

            }


            const confirmed =
                confirm(
                    "Очистити весь кошик?"
                );


            if (!confirmed) {

                return;

            }


            cart = [];


            saveCart();

            updateCart();

        }
    );

}


// ========================================
// CHECKOUT
// ========================================

if (checkout) {

    checkout.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                alert(
                    "Ваш кошик порожній!"
                );

                return;

            }


            let total = 0;


            cart.forEach(item => {

                total += item.price;

            });


            alert(

                "Дякуємо за замовлення! 🎮\n\n" +

                "Товарів: " +
                cart.length +

                "\n" +

                "Сума: " +
                total +

                "₴\n\n" +

                "Це демо-версія LogiGamer."

            );

        }
    );

}


// ========================================
// HERO BUTTON
// ========================================

const letsGo =
    document.getElementById("letsGo");


if (letsGo) {

    letsGo.addEventListener(
        "click",
        function() {

            const games =
                document.getElementById(
                    "games"
                );


            if (games) {

                games.scrollIntoView({

                    behavior: "smooth"

                });

            }

        }
    );

}


// ========================================
// DARK THEME
// ========================================

const themeBtn =
    document.createElement("button");


themeBtn.textContent =
    "🌙";


themeBtn.title =
    "Змінити тему";


themeBtn.setAttribute(
    "aria-label",
    "Змінити тему"
);


themeBtn.style.position =
    "fixed";


themeBtn.style.bottom =
    "20px";


themeBtn.style.right =
    "20px";


themeBtn.style.width =
    "50px";


themeBtn.style.height =
    "50px";


themeBtn.style.border =
    "none";


themeBtn.style.borderRadius =
    "50%";


themeBtn.style.background =
    "#111";


themeBtn.style.color =
    "white";


themeBtn.style.fontSize =
    "20px";


themeBtn.style.cursor =
    "pointer";


themeBtn.style.zIndex =
    "1500";


themeBtn.style.boxShadow =
    "0 5px 20px rgba(0,0,0,0.3)";


document.body.appendChild(
    themeBtn
);


// ========================================
// LOAD THEME
// ========================================

const savedTheme =
    localStorage.getItem(
        "logigamerTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-theme"
    );


    themeBtn.textContent =
        "☀️";

}


// ========================================
// CHANGE THEME
// ========================================

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark-theme"
        );


        const dark =
            document.body.classList.contains(
                "dark-theme"
            );


        if (dark) {

            themeBtn.textContent =
                "☀️";


            localStorage.setItem(
                "logigamerTheme",
                "dark"
            );

        } else {

            themeBtn.textContent =
                "🌙";


            localStorage.setItem(
                "logigamerTheme",
                "light"
            );

        }

    }
);


// ========================================
// GAME SNOWFLAKES
// ========================================

function createSnowflake() {

    const flake =
        document.createElement("div");


    flake.textContent =
        "🎮";


    flake.style.position =
        "fixed";


    flake.style.top =
        "-20px";


    flake.style.left =
        Math.random() *
        window.innerWidth +
        "px";


    flake.style.fontSize =
        (
            Math.random() *
            20 +
            10
        ) + "px";


    flake.style.opacity =
        Math.random();


    flake.style.pointerEvents =
        "none";


    flake.style.zIndex =
        "1";


    flake.style.transition =
        "transform 4s linear, opacity 4s linear";


    document.body.appendChild(
        flake
    );


    setTimeout(() => {

        flake.style.transform =
            `translateY(${
                window.innerHeight + 50
            }px) rotate(360deg)`;


        flake.style.opacity =
            "0";

    }, 50);


    setTimeout(() => {

        flake.remove();

    }, 4000);

}


setInterval(
    createSnowflake,
    300
);


// ========================================
// MUSIC
// ========================================

const music =
    document.getElementById(
        "bgMusic"
    );


const musicBtn =
    document.getElementById(
        "musicBtn"
    );


if (music && musicBtn) {

    musicBtn.addEventListener(
        "click",
        function() {

            if (music.paused) {

                music.play()
                    .then(() => {

                        musicBtn.textContent =
                            "⏸ Пауза";

                    })
                    .catch(() => {

                        alert(
                            "Не вдалося увімкнути музику."
                        );

                    });

            } else {

                music.pause();


                musicBtn.textContent =
                    "🎵 Увімкнути музику";

            }

        }
    );

}


// ========================================
// START
// ========================================

updateCart();
