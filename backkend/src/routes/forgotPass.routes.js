import {Router} from 'express';

const router = Router();

router.get('', (req, res)=>{
    res.render("forgot",{
        title: "Recuperá tu contraseña"
    })
})



export default router;