const addToCartBtns = document.querySelectorAll('.product_card-btnAddToCart');
const viewCart = document.querySelector('.viewCart');
const countProducts = document.querySelector('.countProducts');
const currentCartID = localStorage.getItem("cartIdStored");
const storedUser = localStorage.getItem('storedUser');
const paramsForm = document.querySelector('.params');
const sort = document.querySelector('#sorted');
const limit = document.querySelector('#limit');
const search = document.querySelector('#search');
const logout = document.querySelector('.logout');
const prices = document.querySelectorAll('.product_card-price');
const sections = document.querySelectorAll('.header-section');
const realTimeProductsBtn = document.querySelector('.realTimeProductsBtn');

// Función para actualizar el conteo de productos en el carrito
const updateCart = async (currCart)=>{
    let result = await fetch(`/cart/${currCart}/totalprods`);
    let data = await result.json();
    if(countProducts){
        countProducts.innerText = data.count;
    }
}

// Función para setear la parte dinámica de la url
function setParams(sort,limit,search){
    let params = `/products?limit=${limit}&sorted=${sort}&search=${search}`;
    return params;
}

// Inicia
document.addEventListener('DOMContentLoaded', async e =>{
    updateCart(currentCartID);
})

addToCartBtns.forEach(btn =>{
    btn.addEventListener('click', async e =>{
        const productOwner = e.target.getAttribute('owner')
        if(storedUser == productOwner){
            alert('Sos el owner de este producto y no podés agregarlo al carrito')
        } else {
            Toastify({
                text: "Producto agregado al carrito",
                className: "prod-agregado",
                gravity: "bottom", 
                style: {
                  background: "rgba(43, 11, 117, 0.74)",
                }
              }).showToast();
            const productID = e.target.getAttribute('data-id');
            const res = await fetch(`/cart/${currentCartID}/product/${productID}`, {
                method:"POST"
            });
            console.log({res})
            updateCart(currentCartID)
        }
    })
})

if (viewCart) {
    viewCart.addEventListener('click', e => {
        window.location.href = `/cart/${currentCartID}`;
    })
}

if(paramsForm){
    paramsForm.addEventListener('change', e =>{
        let url = new URL(window.location)
        let searchParam;
        if(url.searchParams.get('search') != '' && search.value == ''){
            searchParam = url.searchParams.get('search');
            console.log(searchParam)
        } else {
            searchParam = search.value || ""
        }
        
        let params = setParams(sort.value, limit.value, searchParam);
        window.location.href = params;
    })
}

logout.addEventListener('click', async (e)=>{
    const res = await fetch(`/api/session/logout`, {
        method:"GET"
    });
    console.log(res)
    if(res.ok){
        window.location.href = '/'
    }
})

prices.forEach(price=>{
    let aux = price.textContent.split('$')[1];
    let newPrice;
    if (aux.length == 4) {
        auxArr = aux.split('')
        newPrice = `$${auxArr[0]}.${auxArr.slice(1).join('')}`
    }
    if (aux.length == 5) {
        auxArr = aux.split('')
        newPrice = `$${auxArr.slice[0,2]}.${auxArr.slice(1).join('')}`
    }
    if (aux.length == 6) {
        auxArr = aux.split('')
        newPrice = `$${auxArr.slice[0,3]}.${auxArr.slice(1).join('')}`
    }
    price.textContent = newPrice || price.textContent
})

sections.forEach(section =>{
    section.addEventListener('click', e =>{
        let url = new URL(window.location);
        let limit = url.searchParams.get('limit') || 10;
        let sorted = url.searchParams.get('sorted') || 0;
        window.location.href = `/products?limit=${limit}&sorted=${sorted}&search=${section.innerText}`
    })
})

if(realTimeProductsBtn){
    realTimeProductsBtn.addEventListener('click', e =>{
        window.location.href = `/realtimeproducts`
    })
}

