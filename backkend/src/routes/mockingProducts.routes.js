import {Router} from 'express';
import {fakerES as faker} from '@faker-js/faker'

const router = Router();

router.get('', (req, res)=>{
    let products = [];
    for (let i = 0; i < 100; i++) {
        products.push(generateProduct())
    }
    res.status(400).json({products})
   
})



export default router;

const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.commerce.isbn(13),
        stock: faker.number.int({ min: 0, max: 500 }),
    }
} 


