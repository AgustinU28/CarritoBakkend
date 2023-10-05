export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name : needs to be a String, recieved ${user.first_name}
    * last_name : needs to be a String, recieved ${user.last_name}
    * email : needs to be a String, recieved ${user.email}
    `
}

export const generateProductErrorInfo = (product) => {
    return `Uno o más atributos del producto no son válidos
    El producto debe tener:
    * Titulo: debe ser de tipo string, mayor a 3 caracteres, el input fue: ${product.title}
    * Descripción: debe ser de tipo string, mayor a 10 caracteres, el input fue: ${product.description}
    * Precio: debe ser de tipo string, el input fue: ${product.price}
    * Imagen: debe ser de tipo string, el input fue: ${product.thumbnail}
    * Código: debe ser de tipo string, el input fue: ${product.code}
    * Stock: debe ser de tipo string, el input fue: ${product.stock}
    `
}