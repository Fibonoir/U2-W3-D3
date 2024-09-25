// Variables
const bookContainer = document.getElementById('book-container');
const cartItemsDropdown = document.getElementById('cart-items-dropdown');
const cartCount = document.getElementById('cart-count');
const totalCart = document.getElementById("totalCart");
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart
const addToCart = (book) => {
    if (!cart.some(item => item.asin === book.asin)) {
        cart.push(book);
        updateCart();
    }
};

// Update cart
const updateCart = () => {
    cartCount.textContent = cart.length;
    cartItemsDropdown.innerHTML = '';

    let totalPrice = 0;

    cart.forEach(book => {
        totalPrice += parseFloat(book.price) || 0;

        const div = document.createElement('div');
        div.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');
        div.innerHTML = `
            <span>${book.title} - $${book.price}</span>
            <button class="btn btn-danger btn-sm">Remove</button>
        `;

        div.querySelector('.btn-danger').addEventListener('click', (event) => {
            if (cart.length > 1) {
                event.stopPropagation();
            }            
            removeFromCart(book);
        });

        cartItemsDropdown.appendChild(div);
    });

    totalCart.innerText =`Total: $${totalPrice.toFixed(2)}`;
    localStorage.setItem('cart', JSON.stringify(cart));
};

const removeFromCart = (book) => {
    cart = cart.filter(item => item.asin !== book.asin);
    updateCart();
};

const createBookCard = (book) => {
    const col = document.createElement('div');
    col.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'col-xs-12');

    col.innerHTML = `
        <div class="card h-100 shadow-sm rounded">
            <img src="${book.img}" class="card-img-top object-fit-cover" alt="${book.title}" style="height:450px">
            <div class="card-body d-flex flex-column justify-content-between">
                <div>
                    <h5 class="card-title text-dark fw-bold text-truncate" title="${book.title}">${book.title}</h5>
                </div>
                <div>
                    <p class="card-text text-secondary mb-4">$${book.price}</p>
                    <button class="btn btn-primary mb-2 w-100">Buy Now</button>
                    <button class="btn btn-danger w-100">Remove</button>
                </div>
            </div>
        </div>
    `;

    col.querySelector('.btn-primary').addEventListener('click', () => {
        addToCart(book);
    });

    col.querySelector('.btn-danger').addEventListener('click', () => {
        col.remove();
    });

    bookContainer.appendChild(col);
};

fetch('https://striveschool-api.herokuapp.com/books')
    .then(response => response.json())
    .then(books => {
        books.forEach(book => {
            createBookCard(book);
        });
    })
    .catch(error => console.error('Error fetching books:', error));

updateCart();
