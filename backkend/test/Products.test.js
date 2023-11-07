import chai from 'chai';
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe('Testing de products', ()=>{
    let cookie;
    let productID;
    let random = Math.floor(Math.random() * 10) + 1
    describe('Test agregar un producto', ()=>{
        it('Debe loguear correctamente al usuario y devolver una cookie', async ()=>{
            const mockUser = {
                "username":"mockuser@mock.io",
                "password": "1234",
                "currentCartID": "654415a32a4fcc6f85098e6b"
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
            console.log({cookie})
        })
        it('El Endpoint de POST /products debe crear un producto correctamente', async ()=>{
            const productMock = {
                title: 'testing',
                description: 'product for testing',
                price: 999,
                stock: 999,
                code: `testing-${random}45asdf-${random}`,
                owner: 'Test',
                thumbnail: "example.jpg"
            }
            const {
                statusCode,
                ok,
                _body
            } = await requester
                    .post('/products').set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productMock);
            expect(_body.payload).to.have.a.property("_id");
            expect(statusCode).to.be.eql(201);
            productID = _body.payload._id
        })
        it('Test de modificación del producto agregado', async ()=>{
            const productModified = { price: 35, stock: 66, title: 'Testing update'}
            const {statusCode, _body} = await requester.put(`/products/${productID}`).set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productModified);
            expect(statusCode).to.be.eql(200)
            const result = await requester.get(`/products/${productID}`).set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productModified)
            expect(result._body.product.price).to.be.eql(35); 
            expect(result._body.product.stock).to.be.eql(66); 
            expect(result._body.product.title).to.be.eql('Testing update'); 
        })
        it('Test de eliminación del producto agregado', async ()=>{
            const {statusCode, _body} = await requester.delete(`/products/${productID}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
            expect(statusCode).to.be.eql(200);
            expect(_body.response._id).to.be.ok.and.be.eql(productID)
        })
    })
})