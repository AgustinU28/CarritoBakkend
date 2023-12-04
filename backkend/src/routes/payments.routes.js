import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";


const router = Router();
const paymentController = new PaymentController()

router.post('/payment-intents', paymentController.paymentIntent)
router.get('/success/:ticketId', (req,res) => {
    const {ticketId} = req.params
    res.status(200).render('payment-success', {ticketId})
})
router.get('/ticketSuccessInfo/:ticketId', paymentController.getTicketInfo)

export default router;