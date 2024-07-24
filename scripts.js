document.addEventListener('DOMContentLoaded', function() {
    const products = [
        { id: 1, name: 'Product 1', price: 10, description: 'Description of Product 1' },
        { id: 2, name: 'Product 2', price: 20, description: 'Description of Product 2' },
        { id: 3, name: 'Product 3', price: 30, description: 'Description of Product 3' },
    ];

    const productList = document.getElementById('product-list');
    const productDetail = document.getElementById('product-detail');
    const cartItems = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');

    // Populate the homepage with products
    if (productList) {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="viewProduct(${product.id})">View Details</button>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productList.appendChild(productElement);
        });
    }

    // Function to view product details
    window.viewProduct = function(id) {
        const product = products.find(p => p.id === id);
        if (product) {
            window.location.href = `product.html?id=${product.id}`;
        }
    };

    // Function to add product to cart
    window.addToCart = function(id) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = products.find(p => p.id === id);
        if (product) {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Product added to cart');
        }
    };

    // Populate the product detail page
    if (productDetail) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const product = products.find(p => p.id == productId);
        if (product) {
            productDetail.innerHTML = `
                <h2>${product.name}</h2>
                <p>Price: $${product.price}</p>
                <p>${product.description}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
        }
    }

    // Populate the shopping cart page
    if (cartItems) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            cartItems.innerHTML = `<p>Your cart is empty</p>`;
        } else {
            cart.forEach(product => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                `;
                cartItems.appendChild(cartItemElement);
            });
        }
    }

    // Handle checkout button click
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            alert('Checkout functionality not implemented yet.');
        });
    }
});
