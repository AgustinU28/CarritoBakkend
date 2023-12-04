import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

let url = process.env.URL;

export default class PaymentService {
    constructor(){
        this.stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)
    }
    createPaymentIntent = async(data)=>{
        
        let date = new Date()
        let paymentData = {
            line_items:[
                {
                    price_data: {
                        product_data: {
                            name: `${data.username} - cart: ${data.cart}`,
                            description: `Compra realizada el: ${date}`
                        },
                        currency: 'usd',
                        unit_amount: data.amount * 100
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${url}/api/payments/success/${data.ticketId}`,
            cancel_url: `${url}`
        }
        const paymentIntent = this.stripe.checkout.sessions.create(paymentData);
        return paymentIntent;
    }
}