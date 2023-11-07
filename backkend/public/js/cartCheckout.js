const countProds = document.querySelector('.countProducts');
const currCartID = localStorage.getItem("cartIdStored");
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
    const loader = document.createElement('span');
    loader.classList.add('loader');
    btnContainer.append(loader);

    let purchase = await fetch(`/cart/${currCartID}/purchase`);
    let purchaseJSON = await purchase.json();
 
    let result = await fetch(`/cart/${currCartID}/totalprods`);
    let data = await result.json();
    countProds.innerText = data.count;
    const remainingProds = [...purchaseJSON.respuesta.remaining];
    const purchasedProds = [...purchaseJSON.respuesta.purchased];
    
    if(purchaseJSON.message == 'Ticket generado'){
        checkoutContainer.innerText="";
        const titlePurchase = document.createElement('h2');
        titlePurchase.classList.add('titlePurchase');
        titlePurchase.innerText = 'Tu compra:';

        const datePurchase = document.createElement('div');
        datePurchase.classList.add('datePurchase');
        datePurchase.innerText = `Fecha de compra: ${purchaseJSON.respuesta.ticket.purchase_datetime}`;

        const userPurchase = document.createElement('div');
        userPurchase.classList.add('userPurchase');
        userPurchase.innerText = `Cliente: ${purchaseJSON.respuesta.ticket.purchaser}`;

        checkoutContainer.append(titlePurchase);
        checkoutContainer.append(datePurchase);
        checkoutContainer.append(userPurchase);

        if(purchasedProds.length > 0){
            purchasedProds.forEach(prod=>{
                const line = document.createElement('p')
                line.innerText = `${prod.product.title} ${prod.quantity} ${prod.price}`
                checkoutContainer.append(line)
            })
        } else {
            const line = document.createElement('p');
            line.innerText = `Ninguno de los productos que compraste cuenta con stock`
            checkoutContainer.append(line)
        }

        if(remainingProds.length > 0){
            const remainingTitle = document.createElement('p');
            remainingTitle.innerText = `Los siguientes productos no tienen stock en nuestra tienda:`
            remainingProds.forEach(prod=>{
                const line = document.createElement('p')
                line.innerText = `${prod.product.title} ${prod.product.price}`
                checkoutContainer.append(line)
            })
        } 
    }
    // if(purchaseJSON.message == 'Ticket generado'){
    //     alert('Compra realizada')
    //     if(purchaseJSON.respuesta.remaining.length > 0){
    //         alert('Algunos productos de tu carrito no tenían stock')
    //     }
    // }
    // window.location.reload();

})

// {
//     "message": "Ticket generado",
//     "respuesta": {
//         "ticket": {
//             "code": "405be23b-d871-41a5-a608-209db494fdcf",
//             "purchase_datetime": "2023-10-07T04:06:44.452Z",
//             "amount": 5262,
//             "purchaser": "gabriel.monlezun@gmail.com",
//             "_id": "6520d95be78eced83918bebd",
//             "__v": 0
//         },
//         "remaining": [
//             {
//                 "product": {
//                     "_id": "64d1662ada5870c6c7c097e2",
//                     "title": "Agua",
//                     "description": "Agua mineral sin gas marca: Villa del Sur, botella 500ml",
//                     "price": 250,
//                     "thumbnail": "https://www.libreriasullivan.com.ar/images/000000000000000041795447-006.jpg",
//                     "code": "4fx2654fx154",
//                     "stock": 0,
//                     "__v": 0,
//                     "category": "Bebidas"
//                 },
//                 "_id": "6520d11cbdbfb3ce74d6f4d6"
//             },
//         ],
//         "purchased": [
//             {
//                 "product": {
//                     "_id": "64d16632da5870c6c7c097e4",
//                     "title": "Pepsi",
//                     "description": "Bebida gaseosa marca: Pepsi, botella 2.25lts",
//                     "price": 850,
//                     "thumbnail": "https://beerstation.com.ar/wp-content/uploads/2022/04/pepsi_225.jpg",
//                     "code": "4fx2660fb164",
//                     "stock": 78,
//                     "__v": 0,
//                     "category": "Bebidas"
//                 },
//                 "_id": "6520d943e78eced83918bde9",
//                 "quantity": 1,
//                 "price": "850"
//             },
//         ]
//     }
// }
// 