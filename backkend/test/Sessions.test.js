import chai from 'chai';
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");


describe('Test de usuarios', ()=>{
    let cookie;
    let userID;
    it('Debe registrar correctamente a un usuario', async ()=>{
        const mockUser = {
            "first_name":"mockuser",
            "last_name":"mockuser",
            "age":33,
            "email":`mockuser_${random}@mock.io`,
            "password":'1234',
            "currentCartID":"654415a32a4fcc6f85098e6b"
        }
        const {_body} = await requester.post('/api/session/signup').send(mockUser)
        expect(_body.payload).to.be.ok;
        userID = _body.payload._id

    })
    it('Debe cambiar el rol de un usuario de user a premium', async ()=> {
        const {_body, statusCode, ok} = await requester.get(`/api/users/premium/${userID}`);
        expect(_body.user.role).to.be.eql('premium');
    })
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
    })   
    })
