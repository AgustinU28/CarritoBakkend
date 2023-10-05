const socket = io();

const productTitle = document.getElementById("productTitle");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productThumbnail = document.getElementById("productThumbnail");
const productCode = document.getElementById("productCode"); 
const productStock = document.getElementById("productStock");
const productCategory = document.getElementById("productCategory");

const deleteBtns = document.querySelectorAll('.btnEliminar');

const form = document.getElementById('productForm');



form.addEventListener('submit',e =>{
    e.preventDefault();
    if (productTitle.value =="" || productDescription.value =="" || productPrice.value =="" || productCode.value =="" || productStock.value =="" ) {
      let errorMessage = document.createElement('DIV')
      errorMessage.innerHTML= `
        <p style="color:red; margin-top: 15px"> Debés completar todos los campos </p>
      `;
      form.appendChild(errorMessage);
    } else {
      socket.emit("addProduct",{
        title: productTitle.value,
        description: productDescription.value,
        price: productPrice.value,
        thumbnail: productThumbnail.value,
        code: productCode.value,
        stock: productStock.value,
        category: productCategory.value
      })
    }
  
    
    productTitle.value = "";
    productDescription.value = "";
    productPrice.value = "";
    productThumbnail.value = "";
    productCode.value = "";
    productStock.value = "";
    
    socket.on("updateList", (products) => {
        updateProductList(products);
      });
})

deleteBtns.forEach(btn => {
    btn.addEventListener('click', e =>{
        const productId = e.target.getAttribute('data-id')
        socket.emit('deleteProduct', {
            id: productId
        })
        socket.on("updateList", (products) => {
            updateProductList(products);
          });
    })
});


// Actualizar la lista de productos
function updateProductList(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h3>${product.title}</h3>
        <p>Descripción: ${product.description}</p>
        <p>Precio: ${product.price}</p>
        <img src=${product.thumbnail} />
        <button class="btnEliminar" data-id="${product._id}">Eliminar</button>
      `;
  
      // Agregar el evento de clic al botón de eliminación
      const btnEliminar = li.querySelector(".btnEliminar");
      btnEliminar.addEventListener('click', e =>{
        const productId = e.target.getAttribute('data-id')
        socket.emit('deleteProduct', {
            id: productId
        })
        socket.on("updateList", (products) => {
            updateProductList(products);
          });
    })
  
      productList.appendChild(li);
    });
  }

const realTimeProductsBtn = document.querySelector('.realTimeProducts');
realTimeProductsBtn.addEventListener('click', e =>{
  window.location.href = '/realtimeproducts'
})
