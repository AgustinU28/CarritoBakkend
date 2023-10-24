import {Router} from 'express';

const router = Router();

router.get('', (req, res)=>{
    res.render("forgotBtn",{
        title: "Recuperá tu contraseña"
    })
})
router.get('/reset-password', (req, res)=>{
    res.render("forgot",{
        title: "Recuperá tu contraseña"
    })
})


export default router;