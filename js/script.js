// Simple hero carousel
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
function showSlide(index) {
    slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
    });
}
setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}, 5000);

// Populate product grid on shop page
function renderProducts(filter = 'all') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <button data-id="${p.id}" class="btn add-cart">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}

const categoryFilter = document.getElementById('category-filter');
if (categoryFilter) {
    categoryFilter.addEventListener('change', () => renderProducts(categoryFilter.value));
    renderProducts();
}

// product detail page
const detailContainer = document.getElementById('product-detail');
if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = products.find(p => p.id === id);
    if (product) {
        detailContainer.innerHTML = `
            <div class="product-detail">
                <img src="${product.image}" alt="${product.name}">
                <div class="detail-info">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p class="price">$${product.price}</p>
                    <button data-id="${product.id}" class="btn add-cart">Add to Cart</button>
                </div>
            </div>
        `;
    }
}

// Highlight sections on landing page
function populateHighlights() {
    const newArrivals = document.getElementById('new-arrivals');
    const bestSellers = document.getElementById('best-sellers');
    const deals = document.getElementById('deals');
    if (newArrivals) {
        products.slice(0, 3).forEach(p => {
            const item = document.createElement('div');
            item.className = 'highlight-item';
            item.innerHTML = `<img src="${p.image}" alt="${p.name}"><p>${p.name}</p>`;
            newArrivals.appendChild(item);
        });
    }
    if (bestSellers) {
        products.slice().reverse().forEach(p => {
            const item = document.createElement('div');
            item.className = 'highlight-item';
            item.innerHTML = `<img src="${p.image}" alt="${p.name}"><p>${p.name}</p>`;
            bestSellers.appendChild(item);
        });
    }
    if (deals) {
        products.forEach(p => {
            const item = document.createElement('div');
            item.className = 'highlight-item';
            item.innerHTML = `<img src="${p.image}" alt="${p.name}"><p>${p.name}</p>`;
            deals.appendChild(item);
        });
    }
}
populateHighlights();

// Testimonials slider
const testimonialSlider = document.getElementById('testimonial-slider');
if (testimonialSlider) {
    testimonials.forEach(t => {
        const div = document.createElement('div');
        div.className = 'testimonial';
        div.innerHTML = `<p>"${t.text}"</p><p class="author">- ${t.author}</p>`;
        testimonialSlider.appendChild(div);
    });
}

// Cart management
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(id) {
    const cart = getCart();
    const product = products.find(p => p.id === id);
    if (!product) return;
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += 1;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    }
    saveCart(cart);
    alert('Added to cart');
}

document.addEventListener('click', e => {
    if (e.target.classList.contains('add-cart')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        addToCart(id);
    }
});

// Render cart
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
function renderCart() {
    if (!cartItems) return;
    const cart = getCart();
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name} (x${item.qty})</span>
            <span>$${item.price * item.qty}</span>
            <button data-id="${item.id}" class="remove btn">Remove</button>
        `;
        cartItems.appendChild(div);
        total += item.price * item.qty;
    });
    cartTotal.textContent = `Total: $${total}`;
}
if (cartItems) {
    renderCart();
    cartItems.addEventListener('click', e => {
        if (e.target.classList.contains('remove')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            let cart = getCart().filter(i => i.id !== id);
            saveCart(cart);
            renderCart();
        }
    });
}

// Simple auth using localStorage (NOT secure)
function getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
}
function setUser(user) {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
}
const authLink = document.getElementById('auth-link');
function updateAuthLink() {
    const user = getUser();
    if (authLink) {
        authLink.textContent = user ? 'Sign Out' : 'Sign In';
        authLink.href = user ? '#' : 'login.html';
    }
}
updateAuthLink();
if (authLink) {
    authLink.addEventListener('click', e => {
        const user = getUser();
        if (user) {
            e.preventDefault();
            setUser(null);
            updateAuthLink();
            alert('Signed out');
        }
    });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const stored = JSON.parse(localStorage.getItem('accounts') || '{}');
        if (stored[email] && stored[email] === password) {
            setUser({ email });
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials');
        }
    });
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const stored = JSON.parse(localStorage.getItem('accounts') || '{}');
        stored[email] = password;
        localStorage.setItem('accounts', JSON.stringify(stored));
        alert('Account created. Please sign in.');
        window.location.href = 'login.html';
    });
}
