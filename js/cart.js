let cart = []

//buttons 
let buttonsDOM = [];


const getProducts = async () => {
    try {
        let response = await fetch("products.json");
        let data = await response.json();
        let products = data;
        return products;
    } catch (error) {
        console.log(error);
    }
}


//variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const cartFooterDOM = document.querySelector(".cart-footer");
const emptyCartFooterDOM = document.querySelector(".empty-cart-footer");
const cartTotal = document.querySelector(".cart-total");
const productDOM = document.querySelector(".box-container");


const displayProducts = products => {
    products.forEach(producto => {
        let displayProducts = document.createElement("box");
        displayProducts.className = "box";
        displayProducts.innerHTML=`
            <div class="image">
                <img src="${producto.img}" alt="">
            </div>
            <div class="content">
                <h3>${producto.modelo}</h3>
                <p></p>
                <div class="price">$${producto.precio}</div>
                <a>
                <button class="btn" data-id="${producto.id}"><i class="fa-solid fa-cart-shopping"></i> Agregar al carrito</button>
                </a>
          </div>
        `
        productDOM.appendChild(displayProducts);
    });
}

    const getButtons = () => {
        const buttons = [...document.querySelectorAll(".btn")];
        buttonsDOM = buttons; 
        buttons.forEach(btn => {
            let id = btn.dataset.id;
            let inCart = cart.find(product => product.id == id);
            if (inCart) {
                btn.innerText = "Agregado";
                btn.disabled = true;
            } 
            btn.addEventListener("click", e => {
                e.target.innerText = "Agregado";
                e.target.disabled = true;
                //get product from products
                let cartItem = {...getProduct(id), amount: 1}; 
                //add product to cart
                cart = [...cart, cartItem];
                //save cart in local storage
                saveCart(cart);
                //set cart values
                setCartValues(cart);
                //display cart item
                addCartItem(cartItem);
                //show cart
                showCart();
            });
        });
    }

    const setCartValues = cart => {
        let tempTotal = 0;
        let itemsTotal = 0; 
        cart.map(item => {
            tempTotal += item.precio * item.amount;
            itemsTotal += item.amount; 
        });
        cartTotal.innerText = tempTotal;
        cartItems.innerText = itemsTotal;
        if (cart.length <= 0) {
            emptyCartFooterDOM.style.display = "block";
            cartFooterDOM.style.display = "none";
        } else {
            emptyCartFooterDOM.style.display = "none";
            cartFooterDOM.style.display = "block";
        }
    }

    const addCartItem = item => {
        let div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
        <img src="${item.img}" alt="Producto">
        <div>
            <h4>${item.modelo}</h4>
            <h5>$${item.precio}</h5>
            <span class="remove-item" data-id=${item.id}>Eliminar</span>
        </div>
        <div>
            <i class="fa-solid fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fa-solid fa-chevron-down" data-id=${item.id}></i>
        </div>
        `;
        cartContent.appendChild(div);
    }

    const showCart = () => {
        cartOverlay.classList.add("transparent-bcg");
        cartDOM.classList.add("show-cart");
    }
    
    const setupApp = () => {
        cart = getCart();
        setCartValues(cart);
        populateCart(cart);
        cartBtn.addEventListener("click", showCart);
        closeCartBtn.addEventListener("click", hideCart);
    }
    
    const populateCart = cart => {
        cart.forEach(item => addCartItem(item));
    }
    
    const hideCart = () => {
        cartOverlay.classList.remove("transparent-bcg");
        cartDOM.classList.remove("show-cart");
    }

const cartLogic = () => {
    //clear cart btn
    clearCartBtn.addEventListener("click", () => {
        swal({
            title: "??Est??s seguro que quer??s vaciar tu carrito?",
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: false,
                    visible: true
                },
                confirm: {
                    text: "S??, estoy seguro",
                    value: true,
                    visible: true,
                    closeModal: true
                }
            }
        }).then(willDelete => willDelete && clearCart());
    });

    //cart functionality
    cartContent.addEventListener("click", e => {
        if (e.target.classList.contains("remove-item")) {
            let removeCartItem = e.target;
            let id = removeCartItem.dataset.id;
            cartContent.removeChild(removeCartItem.parentElement.parentElement);
            removeItem(id);
        } else if (e.target.classList.contains("fa-chevron-up")) {
            let addAmount = e.target;
            let id = addAmount.dataset.id; 
            let tempItem = cart.find(item => item.id == id);
            tempItem.amount++; 
            saveCart(cart);
            setCartValues(cart);
            addAmount.nextElementSibling.innerText = tempItem.amount;
        } else if (e.target.classList.contains("fa-chevron-down")) {
            let lowerAmount = e.target;
            let id = lowerAmount.dataset.id; 
            let tempItem = cart.find(item => item.id == id);
            tempItem.amount--; 
            if (tempItem.amount > 0) {
                saveCart(cart);
                setCartValues(cart);
                lowerAmount.previousElementSibling.innerText = tempItem.amount;
            } else {
                cartContent.removeChild(lowerAmount.parentElement.parentElement);
                removeItem(id);
            }
        }
    });
}

const clearCart = () => {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => removeItem(id));
    while (cartContent.children.length > 0) {
        cartContent.removeChild(cartContent.children[0]);
    }
    hideCart();
}

const removeItem = id => {
    cart = cart.filter(item => item.id != id);
    setCartValues(cart);
    saveCart(cart);
    let button = getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Agregar al carrito`;
}

const getSingleButton = id => buttonsDOM.find(button => button.dataset.id == id);

//localstorage
const saveProducts = products => {
    localStorage.setItem("products", JSON.stringify(products));
}

const getProduct = id => {
    products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id == id);
}

const saveCart = cart => {
    localStorage.setItem("cart", JSON.stringify(cart));
}

const getCart = () => localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

// Inicio
setupApp();

//get all products 
getProducts().then(products => {
    displayProducts(products);
    saveProducts(products);
}).then(() => {
    getButtons();
    cartLogic();
});
