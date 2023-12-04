document.addEventListener('DOMContentLoaded', async e =>{
    const successContainer = document.querySelector('.success_container');
    const successBackBTN = document.querySelector('.success-back');
    const currCartID = localStorage.getItem("cartIdStored");
    const username = localStorage.getItem("storedUser");
    const ticketId = successContainer.getAttribute('data-id');
    console.log({ticketId})
    let purchase = await fetch(`/api/payments/ticketSuccessInfo/${ticketId}`);
    let purchaseJSON = await purchase.json();
    
    console.log(purchaseJSON)
    const remainingProds = purchaseJSON.payload.remainingProds || [];
    const purchasedProds = purchaseJSON.payload.purchasedProds || [];
    console.log(purchasedProds)
    const purchasedQty = purchasedProds.length;

    let purchasedAmount = 0;

    purchasedProds.forEach(prod => purchasedAmount += prod.product.price )

    if(purchaseJSON.status == 'success' && purchaseJSON.payload.purchasedProds.length > 0){
        const titlePurchase = document.createElement('h2');
        titlePurchase.classList.add('titlePurchase');
        titlePurchase.innerText = `¡Compra realizada con éxito! - id: ${purchaseJSON.payload.code}`;

        const datePurchase = document.createElement('div');
        datePurchase.classList.add('datePurchase');
        datePurchase.innerText = `Fecha de compra: ${purchaseJSON.payload.purchase_datetime}`;

        const userPurchase = document.createElement('div');
        userPurchase.classList.add('userPurchase');
        userPurchase.innerText = `Cliente: ${purchaseJSON.payload.purchaser}`;


        successContainer.append(titlePurchase);

        const hr = document.createElement('HR');
        hr.classList.add('hr-paymentSuccess');
        successContainer.append(hr);

        successContainer.append(datePurchase);
        successContainer.append(userPurchase);

        if(purchasedProds.length > 0){
            const titleProdsPurchased = document.createElement('div');
            titleProdsPurchased.classList.add('titleProdsPurchased');
            titleProdsPurchased.innerText = "Detalle de tu compra: ";

            successContainer.append(titleProdsPurchased);

            purchasedProds.forEach(prod=>{
                const line = document.createElement('p')
                line.innerText = `- ${prod.product.title} $${prod.product.price}`
                successContainer.append(line)
            })

            const qtyPurchase = document.createElement('div');
            qtyPurchase.classList.add('qtyPurchase');
            qtyPurchase.innerText = `Cantidad de productos: ${purchasedQty}`;
            
            const amountPurchase = document.createElement('div');
            amountPurchase.classList.add('amountPurchase');
            amountPurchase.innerText = `Total pagado: $${purchasedAmount}`;
            
            successContainer.append(qtyPurchase)
            successContainer.append(amountPurchase)

        } else {
            const line = document.createElement('p');
            line.innerText = `Ninguno de los productos que compraste cuenta con stock`
            successContainer.append(line)
        }

        if(remainingProds.length > 0){
            const remainingTitle = document.createElement('p');
            remainingTitle.classList.add('remainingTitle')
            remainingTitle.innerText = `Los siguientes productos no tienen stock en nuestra tienda:`
            successContainer.append(remainingTitle)
            remainingProds.forEach(prod=>{
                const line = document.createElement('p')
                line.innerText = `- ${prod.product.title} $${prod.product.price}`
                successContainer.append(line)
            })
        } 
        getCartId()
        successBackBTN.addEventListener('click', e =>{
            e.preventDefault();
            window.location.href = '/products'
        })
    }


})


async function getCartId() {
    const res = await fetch("/cart", {
        method:"POST",
    })
    const data = await res.json();
    console.log(data)
    currentCartID = await data.payload._id;
    localStorage.setItem("cartIdStored",currentCartID)
  }