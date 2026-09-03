document.addEventListener('DOMContentLoaded', () => {

    /* ================================================
       1. ЕЛЕМЕНТИ DOM
    ================================================ */
    const catalogBtn = document.getElementById('catalogBtn');
    const catalogMenu = document.getElementById('catalogMenu');
    
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const searchInput = document.getElementById('searchInput');
    const gamesGrid = document.getElementById('gamesGrid');
    const gameCards = document.querySelectorAll('.card');
    const categoryTitle = document.getElementById('categoryTitle');

    const letsGoBtn = document.getElementById('letsGo');

    // Масив для збереження товарів у кошику (зчитуємо з localStorage або створюємо порожній)
    let cart = JSON.parse(localStorage.getItem('logiGamerCart')) || [];


    /* ================================================
       2. ВИНАДАЮЧЕ МЕНЮ (КАТАЛОГ)
    ================================================ */
    if (catalogBtn && catalogMenu) {
        // Перемикання видимості меню при кліку на кнопку "Каталог"
        catalogBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            catalogMenu.classList.toggle('active');
        });

        // Закриття меню при кліку в будь-якому іншому місці екрана
        document.addEventListener('click', (e) => {
            if (!catalogWrapperContains(e.target)) {
                catalogMenu.classList.remove('active');
            }
        });
    }

    function catalogWrapperContains(target) {
        const wrapper = document.querySelector('.catalog-wrapper');
        return wrapper && wrapper.contains(target);
    }


    /* ================================================
       3. УПРАВЛІННЯ КОШИКОМ (MODAL & OVERLAY)
    ================================================ */
    function openCart() {
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Забороняємо прокрутку сторінки при відкритому кошику
    }

    function closeCart() {
        cartOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Відновлюємо прокрутку
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

    // Закриття кошика при кліку на затемнений оверлей
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                closeCart();
            }
        });
    }


    /* ================================================
       4. ЛОГІКА КОШИКА (ADD, REMOVE, RENDER)
    ================================================ */
    
    // Додавання товару в кошик
    function addToCart(name, price) {
        price = parseFloat(price);
        
        // Перевіряємо, чи є вже такий товар
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        saveCart();
        updateCartUI();
        openCart(); // Відкриваємо кошик після додавання
    }

    // Видалення товару з кошика
    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        saveCart();
        updateCartUI();
    }

    // Збереження в LocalStorage
    function saveCart() {
        localStorage.setItem('logiGamerCart', JSON.stringify(cart));
    }

    // Оновлення відображення кошика та лічильників
    function updateCartUI() {
        // Обчислюємо загальну кількість та суму
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Оновлюємо лічильник у шапці та підсумок у кошику
        if (cartCount) cartCount.textContent = totalCount;
        if (cartTotal) cartTotal.textContent = `${totalPrice} ₴`;

        // Рендеримо список товарів
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <p class="empty-cart">🛒 Кошик порожній</p>
            `;
            return;
        }

        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} ₴ ${item.quantity > 1 ? `x ${item.quantity}` : ''}</p>
                </div>
                <button class="remove-item" data-name="${item.name}" type="button" title="Видалити">
                    🗑️
                </button>
            `;

            cartItemsContainer.appendChild(itemElement);
        });

        // Додаємо обробники для кнопок видалення
        const removeButtons = cartItemsContainer.querySelectorAll('.remove-item');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.getAttribute('data-name');
                removeFromCart(name);
            });
        });
    }

    // Події для кнопок "🛒 В кошик" на картках товарів
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('add-cart')) {
            const name = e.target.getAttribute('data-name');
            const price = e.target.getAttribute('data-price');
            if (name && price) {
                addToCart(name, price);
            }
        }
    });

    // Оформлення замовлення
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Ваш кошик порожній!');
                return;
            }

            alert('Дякуємо за замовлення! Менеджер зв\'яжеться з вами найближчим часом.');
            cart = [];
            saveCart();
            updateCartUI();
            closeCart();
        });
    }


    /* ================================================
       5. ЖИВИЙ ПОШУК ІГОР
    ================================================ */
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            gameCards.forEach(card => {
                const gameName = card.getAttribute('data-name') ? card.getAttribute('data-name').toLowerCase() : '';
                
                if (gameName.includes(query)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Динамічне оновлення заголовку категорії при пошуку
            if (categoryTitle) {
                if (query.length > 0) {
                    categoryTitle.textContent = `Результати пошуку (${visibleCount})`;
                } else {
                    categoryTitle.textContent = 'Головоломки';
                }
            }
        });
    }


    /* ================================================
       6. HERO КНОПКА (ПЛАВНИЙ СКРОЛ)
    ================================================ */
    if (letsGoBtn) {
        letsGoBtn.addEventListener('click', () => {
            const gamesSection = document.getElementById('games');
            if (gamesSection) {
                gamesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }


    /* ================================================
       7. ІНІЦІАЛІЗАЦІЯ ПРИ ЗАВАНТАЖЕННІ
    ================================================ */
    updateCartUI();
});
