import chai from 'chai';
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe('Testing de Carts', ()=>{
    let cookie;
    const productID = "64dc46961553f1dfa5625ecf";
    let random = Math.floor(Math.random() * 10) + 1;
    let cartID;
    let username = "mockuser@mock.io"
    it('Debe crear un nuevo carrito vía endpoint /carts con método POST', async ()=>{
        const {_body} = await requester.post('/cart');
        expect(_body.payload).to.be.ok.and.has.property('_id')
        cartID = _body.payload._id
    })
    it('Debe loguear correctamente al usuario y devolver una cookie', async ()=>{
        const mockUser = {
            "username": username,
            "password": "1234",
            "currentCartID": `${cartID}`
        }
        const result = await requester.post('/api/session/login').send(mockUser);
        const cookieResult = result.headers['set-cookie'][0]
        expect(cookieResult).to.be.ok;
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }
        expect(cookie.name).to.be.ok.and.eql('connect.sid');
        expect(cookie.value).to.be.ok;
    })
    it('Debe agregar un producto al carrito', async ()=>{
        const { statusCode, _body} = await requester.post(`/cart/${cartID}/product/${productID}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eql(201);
        expect(_body.response).to.have.a.property("_id");
        expect(_body.response.products).to.be.an("Array");
    })
    it('Debe la cantidad de productos que existen en el carrito del usuario', async ()=>{
        const {statusCode, _body} = await requester.get(`/cart/${cartID}/totalprods`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eql(200);
        expect(_body.count).to.be.eql(1)
    })

})
