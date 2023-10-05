import { Router } from "express";
import { createHash } from "../utils.js";
import passport from "passport";
import {UserManager} from "../dao/dbManagers/DBuserManager.js"

const userManager = new UserManager()

const router = Router();

export function authUser(req, res, next) {
  if (req.session?.username) {
    return next();
  }
  return res.status(401).json("error de autenticacion");
}

export function authAdmin(req, res, next) {
  if (req.session?.username && req.session?.role == "admin") {
    return next();
  }
  return res.status(401).json("error de autenticacion");
}


// Login con Passport
router.post('/login', passport.authenticate('login'), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({status:'Error', error:'Credenciales inválidas'})
  } else {
    req.session.username = req.user.email;
    req.session.currentCartID = req.user.currentCartID;
    req.session.role = req.user.role;

    const result = await userManager.setCartID(req.user.email, req.user.currentCartID)
 
    res.status(200).json({status:'ok', message: 'Logueado exitosamente', bd: result})
  }
})

router.get('/failLogin', async (req, res)=>{
  res.render("failLogin", {title:'Falló'} )
})

router.post('/signup', passport.authenticate('register', {failureRedirect:'/failSignup'}), async (req, res)=>{
  const {email, currentCartID} = req.body;
  req.session.username = email;
  req.session.currentCartID = currentCartID;
  req.session.role = req.user.role;

  const result = await userManager.setCartID(req.user.email, req.user.currentCartID)

  res.status(200).json({status:'ok', message: 'user Registered', bd:result})
})

// ------------------------------------------- EDIT

router.get('/failSignup', async (req, res)=>{
  console.log('Failed');
  res.send({error: 'failed'})
})

router.get('/logout', (req,res)=>{
  req.session.destroy((err) => {
    if (!err) {
      res.json({respuesta:'ok'});
    } else {
      res.json({
        status: "Error al cerrar sesion",
        body: err,
      });
    }
  });
})

router.post("/forgot", async (req, res) => {
  const { username, password } = req.body;

  const result = await UserModel.find({
    email: username,
  });

  if (result.length === 0)
    return res.status(401).json({
      respuesta: "el usuario no existe",
    });
  else {
    const respuesta = await UserModel.findByIdAndUpdate(result[0]._id, {
      password: createHash(password),
    });
    res.status(200).json({
      status:'ok',
      respuesta: "se cambio la contraseña",
      datos: respuesta,
    });
  }
});


router.get('/github', passport.authenticate('github',
  { scope:['user:email'] }), async (req,res) => {})

  router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.username = req.user.email;
    res.redirect('/products');
  })
  
export default router;



