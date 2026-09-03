document.addEventListener('DOMContentLoaded', () => {
    // 1. Елементи
    const catalogBtn = document.getElementById('catalogBtn');
    const catalogMenu = document.getElementById('catalogMenu');
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.card');

    const cartBtn = document.getElementById('cartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkout');

    let cart = JSON.parse(localStorage.getItem('lg2_cart')) || [];

    // 2. Випадаюче меню каталогу
    if (catalogBtn && catalogMenu) {
        catalogBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            catalogMenu.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            catalogMenu.classList.remove('show');
        });
    }

    // 3. Пошук ігор у реальному часі
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            cards.forEach(card => {
                const title = card.dataset.name.toLowerCase();
                if (title.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 4. Логіка Кошика
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">🛒 Кошик порожній</p>';
            cartTotal.textContent = '0₴';
            cartCount.textContent = '0';
            return;
        }

        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            total += Number(item.price);
            count += 1;

            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>${item.price} ₴</span>
                </div>
                <button class="remove-item" data-index="${index}">✕</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotal.textContent = `${total}₴`;
        cartCount.textContent = count;

        // Збереження в LocalStorage
        localStorage.setItem('lg2_cart', JSON.stringify(cart));
    }

    // Додавання в кошик
    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = button.dataset.price;

            cart.push({ name, price });
            updateCartUI();

            // Анімація або сповіщення
            button.textContent = '✓ Додано!';
            setTimeout(() => {
                button.textContent = '🛒 В кошик';
            }, 1000);
        });
    });

    // Видалення з кошика
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            updateCartUI();
        }
    });

    // Очистити кошик
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            updateCartUI();
        });
    }

    // Оформити замовлення
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Твій кошик порожній!');
                return;
            }
            alert('Дякуємо за замовлення! Менеджер зв\'яжеться з тобою.');
            cart = [];
            updateCartUI();
            cartOverlay.classList.remove('active');
        });
    }

    // Відкриття / закриття кошика
    if (cartBtn && cartOverlay && closeCart) {
        cartBtn.addEventListener('click', () => cartOverlay.classList.add('active'));
        closeCart.addEventListener('click', () => cartOverlay.classList.remove('active'));

        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                cartOverlay.classList.remove('active');
            }
        });
    }

    // Початкове оновлення UI
    updateCartUI();
});
