const addToCartBtns = document.querySelectorAll('.product_card-btnAddToCart');
const viewCart = document.querySelector('.viewCart');
const countProducts = document.querySelector('.countProducts')

const currentCartID = localStorage.getItem("cartIdStored");
const storedUser = localStorage.getItem('storedUser');

document.addEventListener('DOMContentLoaded', async e =>{
    let result = await fetch(`/cart/${currentCartID}/totalprods`);
    let data = await result.json();
    if(countProducts){
        countProducts.innerText = data.count;
    }
})


addToCartBtns.forEach(btn =>{
    btn.addEventListener('click', async e =>{
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
        let result = await fetch(`/cart/${currentCartID}/totalprods`);
        let data = await result.json();
        countProducts.innerText = data.count;
    })
})
if (viewCart) {
    viewCart.addEventListener('click', e => {
        window.open(`/cart/${currentCartID}`, "_blank")
    })
}


const paramsForm = document.querySelector('.params');
const sort = document.querySelector('#sorted');
const limit = document.querySelector('#limit');
const search = document.querySelector('#search')

function setParams(sort,limit,search){
    
    if(!search){
        if(window.location.search != ''){
            let urlSearchParam = window.location?.search?.split('&')[2].split('=')[1] || "";
            search = urlSearchParam;
        }
    } 
    let params = `/products?limit=${limit}&sorted=${sort}&search=${search}`
    return params;
}
if(paramsForm){
    paramsForm.addEventListener('change', e =>{
        let params = setParams(sort.value, limit.value, search.value || "");
        window.location.href = params
    })
}


const logout = document.querySelector('.logout');

logout.addEventListener('click', async (e)=>{
    const res = await fetch(`/api/session/logout`, {
        method:"GET"
    });
    console.log(res)
    if(res.ok){
        window.location.href = '/'
    }
})

const prices = document.querySelectorAll('.product_card-price');

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

const sections = document.querySelectorAll('.header-section')

sections.forEach(section =>{
    section.addEventListener('click', e =>{
        window.location.href = `/products?search=${section.innerText}`
    })
})

const realTimeProductsBtn = document.querySelector('.realTimeProductsBtn')

if(realTimeProductsBtn){
    realTimeProductsBtn.addEventListener('click', e =>{
        window.location.href = `/realtimeproducts`
    })
}

