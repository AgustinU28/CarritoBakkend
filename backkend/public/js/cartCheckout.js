const countProds = document.querySelector('.countProducts')
const currCartID = localStorage.getItem("cartIdStored");
const confirmPurchaseBTN = document.querySelector('.confirmPurchaseBTN')

document.addEventListener('DOMContentLoaded', async e =>{
    let result = await fetch(`/cart/${currCartID}/totalprods`);
    let data = await result.json();
    countProds.innerText = data.count;
})

confirmPurchaseBTN.addEventListener('click', async e =>{
    let purchase = await fetch(`/cart/${currCartID}/purchase`);
    let purchaseJSON = await purchase.json();
    let result = await fetch(`/cart/${currCartID}/totalprods`);
    let data = await result.json();
    countProds.innerText = data.count;
    let remainingProds = []
    if(purchaseJSON.message == 'Ticket generado'){
        alert('Compra realizada')
        if(purchaseJSON.respuesta.remaining.length > 0){
            alert('Algunos productos de tu carrito no tenían stock')
        }
    }
    window.location.reload();
    // console.log(purchaseJSON.ticket, purchaseJSON.remainingProds, purchaseJSON.purchased)
})