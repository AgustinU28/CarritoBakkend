import { Router } from "express";
import { createHash, isValidPassword} from "../utils.js";
import passport from "passport";
import {UserManager} from "../dao/dbManagers/DBuserManager.js"
import {ForgotManager} from "../dao/dbManagers/DBforgotManager.js"

import crypto from 'node:crypto'

import UserModel from "../dao/models/users.model.js"

import CustomError from "../services/errors/customError.js";
import EErrors from "../services/errors/enumError.js"

import nodemailer from 'nodemailer';

import { __dirname } from "../utils.js";

const userManager = new UserManager();
const forgotManager = new ForgotManager();


const router = Router();

export function authUser(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  const error = CustomError.createError({
    name: "Usuario no autenticado",
    cause:"Missing session",
    message:"Error trying to validate user",
    code:EErrors.AUTHENTICATION_ERROR,
  })
  return res.status(401).json({error});
}

export function authAdmin(req, res, next) {
  if (req.session?.username && req.session?.role == "admin") {
    return next();
  }
  const error = CustomError.createError({
    name: "Usuario no autenticado",
    cause:"Missing session",
    message:"Error trying to validate user",
    code:EErrors.AUTHENTICATION_ERROR,
  })
  return res.status(401).json({error});
}

export function authPremium(req, res, next) {

  if (req.session?.username && (req.session?.role == "premium" || req.session?.role == "admin")) {
    return next();
  }
  const error = CustomError.createError({
    name: "Usuario no autenticado",
    cause:"Missing session",
    message:"Error trying to validate user",
    code:EErrors.AUTHENTICATION_ERROR,
  })
  return res.status(401).json({error});
}

// Login con Passport
router.post('/login', passport.authenticate('login'), async (req, res) => {
  let error;
  if (!req.user) {
      error = CustomError.createError({
      name: "Error en login",
      cause:"Credenciales inválidas",
      message:"Error trying to validate user",
      code:EErrors.AUTHENTICATION_ERROR,
    })
    req.logger.warning('Warning: Credenciales incorrectas');
    return res.status(401).json({error});
  } else {
    req.session.username = req.user.email;
    req.session.currentCartID = req.user.currentCartID;
    req.session.role = req.user.role;

    const result = await userManager.setCartID(req.user.email, req.user.currentCartID)
    res.status(200).json({status:'ok', message: 'Logueado exitosamente'})
  }
})
router.post('/signup', passport.authenticate('register', {failureRedirect:'/signup'}), async (req, res)=>{
  const {email, currentCartID} = req.body;
  req.session.username = email;
  req.session.currentCartID = currentCartID;
  req.session.role = req.user.role;

  const result = await userManager.setCartID(email, currentCartID)

  res.status(200).json({status:'ok', message: 'user Registered', payload:result})
})
router.get('/logout', (req,res)=>{
  req.logOut();
  req.session.destroy((err) => {
    if (!err) {
      res.json({respuesta:'ok'});
    } else {
      req.logger.error('Error: no pudimos cerrar la sesión');
      res.json({
        status: "Error al cerrar sesion",
        body: err,
      });
    }
  });
})
router.post("/forgot", async (req, res) => {
  const { username, password } = req.body;

  const result = await UserModel.findOne({
    email: username,
  });
  if (result.length === 0){
    req.logger.error('Error: el usuario no existe')
    return res.status(401).json({
      respuesta: "el usuario no existe",
    });
  } else if(isValidPassword(result.password, password)){
    return res.status(401).json({
      respuesta: "La contraseña no puede ser la misma",
    });
  } else {
    const respuesta = await UserModel.findByIdAndUpdate(result._id, {
      password: createHash(password),
    });
    res.status(200).json({
      status:'ok',
      respuesta: "se cambio la contraseña",
      datos: respuesta,
    });
  }
});
router.post("/forgotbtn", async (req, res) => {
  const { username } = req.body;

  const result = await UserModel.find({
    email: username,
  });

  if (result.length === 0){
    req.logger.error('Error: el usuario no existe')
    return res.status(401).json({
      respuesta: "el usuario no existe",
    });
  } else {
        // Genero el objeto ticket   
        let forgotObj = {
          email: username,
          code: crypto.randomUUID(),
          createdAt: new Date(),
      }
      try {
        const createForgotObj = await forgotManager.assignForgot(forgotObj);
      } catch (error) {
        console.log(error)
      }
      // Config del mail
      const transport = nodemailer.createTransport({
          service: 'gmail',
          port: 587,
          auth: {
              user: process.env.USER_MAIL,
              pass: process.env.PASSWORD_MAIL
          }
      })
      // envío el mail
      await transport.sendMail({
          from:`Purchase Testing <${process.env.USER_MAIL}>`,
          to:`${username}`,
          subject:"Resetear contraseña",
          html:`
          <body style="padding: 0; margin: 0;">
              <header style="width: 100%; height: 120px; display: flex; flex-direction: row; justify-content: space-between; align-items: center;background: #0F2027;  /* fallback for old browsers */; background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);  /* Chrome 10-25, Safari 5.1-6 */;background: linear-gradient(to right, #2C5364, #203A43, #0F2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */; ">
                  <picture style="width: 100%;">
                      <img src="cid:Logo" alt="The Market Logo" style="height: 100px;">
                  </picture>
              </header>
              <main>
              <p style="margin-left: 40px; margin-top: 30px;"> Solicitud creada el ${forgotObj.createdAt} <span style="color: rgb(175, 52, 52);">*</span></p>
                  <p style="text-align: end; padding: 0 20px;">Reset de contraseña de tu cuenta ${forgotObj.email} en tienda The Market ></p>
                  <p style=""> Hacé click en el siguiente botón para realizar el reseteo de tu contraseña</p>
                  <button><a>Resetear contraseña</a><button>
                  <p style=""> Si el botón no funciona podés ingresar a la siguiente URL http://localhost:8080/api/session/forgot/${forgotObj.code}</p>
                  <p style="margin-left: 40px;margin-top: 50px;"><span style="color: rgb(175, 52, 52);">*</span>Si no realizaste esta solicitud, por favor desestimá este mail</p>
              </main>
              <footer style="height: 50px; width: 100%; background-color: #252525; color: #fafafa; display: flex; align-items: center; margin-top: 30px;"><p style="margin-left: 20px;">Equipo The Market®</p></footer>
          </body>`,
          attachments:[{
              filename: 'Logo.png',
              path:__dirname+'/../public/images/Logo.png',
              cid:'Logo'
          }]
        })

    res.status(200).json({
      status:'ok',
      respuesta: "Mail enviado",
    });
  }
});
router.get('/forgot/:code', async (req,res)=>{
  const {code} = req.params;
  const result = await forgotManager.searchCode(code)
  if (result){
    res.redirect('/forgot/reset-password')
  } else {
    res.redirect('/forgot')
  }
})
router.get('/github', passport.authenticate('github',
  { scope:['user:email'] }), async (req,res) => {})
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),
  async (req,res) =>{
    req.session.username = req.user.email;
    res.redirect('/products')
  }
  )
export default router;











// Login sin hash del password

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   const result = await UserModel.find({
//     email: username,
//     password,
//   });

//   if(result.length != 0){
//     req.session.username = username;
//     req.session.admin = true;
//     return res.status(200).json({
//       username: req.session.username,
//       admin: req.session.admin,
//       respuesta: result,
//       status: 'ok',
//     })

 
//   } else {
//     return res.status(401).json({
//       respuesta: "error",
//     });
//   }
// });

// Login con hash del password

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   const user = await UserModel.findOne({ email: username });

//   if(user.length != 0){
//     if (!isValidPassword(user.password, password)) {
//       return res.status(403).send({status:'error', error:'incorrect password'});
//     }
//     delete user.password;
//     req.session.username = user.email;
//     req.session.admin = true;

//     return res.status(200).json({
//       username: req.session.username,
//       admin: req.session.admin,
//       respuesta: user,
//       status: 'ok',
//     })
//   } else {
//     return res.status(401).json({
//       respuesta: "error",
//     });
//   }
// });


// Signup sin hashear la contraseña 

// router.post("/signup", async (req, res) => {
//   const { first_name, last_name, age, email, password } = req.body;
//   const result = await UserModel.create({
//     first_name,
//     last_name,
//     age,
//     email,
//     password,
//   });
//   if (!result) {
//     return res.status(401).json({
//       respuesta: "error",
//     });
//   } else {
//     req.session.username = email;
//     req.session.admin = true;
//     res.status(200).json({
//       status: "ok",
//     });
//   }
// });

// signup con hash de la contraseña

// router.post("/signup", async (req, res) => {

//   const { first_name, last_name, age, email, password } = req.body;
//   const result = await UserModel.create({
//     first_name,
//     last_name,
//     age,
//     email,
//     password: createHash(password),
//   });
//   if (!result) {
//     return res.status(401).json({
//       respuesta: "error",
//     });
//   } else {
//     req.session.username = email;
//     req.session.admin = true;
//     res.status(200).json({
//       status: "ok",
//     });
//   }
// });
