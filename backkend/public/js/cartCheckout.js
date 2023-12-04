const countProds = document.querySelector('.countProducts');
const currCartID = localStorage.getItem("cartIdStored");
const username = localStorage.getItem("storedUser");
const confirmPurchaseBTN = document.querySelector('.confirmPurchaseBTN');
const checkoutContainer = document.querySelector('.checkout_container');
const btnContainer = document.querySelector('.btn_container')

document.addEventListener('DOMContentLoaded', async e =>{
    let result = await fetch(`/cart/${currCartID}/totalprods`);
    let data = await result.json();
    countProds.innerText = data.count;
})

confirmPurchaseBTN.addEventListener('click', async e =>{

    btnContainer.innerHTML = "";
    const loader = document.createElement('DIV');
    loader.classList.add('loader');
    btnContainer.append(loader);
    let data = {
        cartId:  currCartID,
        username: username,
    }
    const res = await fetch('/api/payments/payment-intents',{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
          },
    });
    const resDataJSON = await res.json();
    console.log(resDataJSON)
    window.location.href = resDataJSON.payload.url
})


