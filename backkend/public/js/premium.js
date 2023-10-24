
const productTitle = document.getElementById("productTitle");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productThumbnail = document.getElementById("productThumbnail");
const productCode = document.getElementById("productCode"); 
const productStock = document.getElementById("productStock");
const productCategory = document.getElementById("productCategory");
const productOwner = document.getElementById("productOwner");

const deleteBtns = document.querySelectorAll('.btnEliminar');

const form = document.getElementById('productForm');

const storedUser = localStorage.getItem('storedUser');

form.addEventListener('submit',async e =>{
    e.preventDefault();
    if (productTitle.value =="" || productDescription.value =="" || productPrice.value =="" || productCode.value =="" || productStock.value =="" ) {
      let errorMessage = document.createElement('DIV')
      errorMessage.innerHTML= `
        <p style="color:red; margin-top: 15px"> Debés completar todos los campos </p>
      `;
      form.appendChild(errorMessage);
    } else {
      let product = {
        title: productTitle.value,
        description: productDescription.value,
        price: productPrice.value,
        thumbnail: productThumbnail.value,
        code: productCode.value,
        stock: productStock.value,
        category: productCategory.value,
        owner: productOwner.value,
      }
      const response = await fetch("/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const result = await response.json();
      if(result.data.code){
        Toastify({
          text: "Producto agregado",
          className: "prod-agregado",
          gravity: "bottom", 
          style: {
            background: "rgba(43, 11, 117, 0.74)",
          }
        }).showToast();
        renderProducts()
      }
    }
  
    
    productTitle.value = "";
    productDescription.value = "";
    productPrice.value = "";
    productThumbnail.value = "";
    productCode.value = "";
    productStock.value = "";
    
})

deleteBtns.forEach(btn => {
    btn.addEventListener('click',async e =>{
        const productId = e.target.getAttribute('data-id')
        const productOwner = e.target.getAttribute('owner')
        if(productOwner == storedUser){
          const response = await fetch(`/products/${productId}`, {
            method: "DELETE",
          });
          console.log({response})
          if(response.ok){
            Toastify({
              text: "Producto eliminado",
              className: "prod-agregado",
              gravity: "bottom", 
              style: {
                background: "rgba(43, 11, 117, 0.74)",
              }
            }).showToast();
            renderProducts()
          }
        } else {
          alert('no se puede eliminar, no agregaste este producto')
        }
    })

});

// const renderProducts = async () => {
//   const data = await fetch('/products/allproducts')
//   const products = await data.json()
  
//   console.log({data})
//   console.log({products})
//   console.log('acá')
//   updateProductList(data)
// }
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
      btnEliminar.addEventListener('click', async e =>{
        const productId = e.target.getAttribute('data-id')
        const productOwner = e.target.getAttribute('owner')
        if(productOwner == storedUser){
          const response = await fetch(`/products/${productId}`, {
            method: "DELETE",
          });
          console.log({response})
          if(response.ok){
            Toastify({
              text: "Producto eliminado",
              className: "prod-agregado",
              gravity: "bottom", 
              style: {
                background: "rgba(43, 11, 117, 0.74)",
              }
            }).showToast();
            renderProducts()
          }
        } else {
          alert('no se puede eliminar, no agregaste este producto')
        }
    })
  
      productList.appendChild(li);
    });
  }
