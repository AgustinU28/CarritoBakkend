import {Router} from 'express';

const router = Router();

router.get('', (req, res)=>{
    if(req.session?.username){
        res.redirect('/products')
    } else {
        res.render("login",{
            title: "Inicia sesión"
        })
    }
   
})



export default router;