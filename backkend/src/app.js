import express from 'express';
import { engine } from "express-handlebars";
import { Server } from 'socket.io';

import { __dirname } from './utils.js';

import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import realtimeRouter from './routes/realtimeprods.routes.js';
import chatRouter from './routes/chat.routes.js';
import loginRouter from './routes/login.routes.js';
import sessionRouter from './routes/session.routes.js';
import signupRouter from './routes/signup.routes.js'; 
import forgotRouter from './routes/forgotPass.routes.js';

import { ProductManager } from "./dao/dbManagers/DBproductManager.js";

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from "cookie-parser";
import { MessageManager } from './dao/dbManagers/DBmessageManager.js'; 
import passport from 'passport';
import initializePassport from './config/passport.config.js';



// Inicialización de dotenv
dotenv.config();

// Inicialización de express
const app = express();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const DB = process.env.DB_NAME
const MONGODB_URI = `${MONGODB_URL}${DB}`

// Conexión a la Base de datos en Mongo Atlas
const environment = async () => {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("Conexión a la base de datos Exitosa");
    } catch (error) {
      console.log(error);
    }
  };
  
environment();



// Inicialización de las instancias de Producto y Mensajes
const productManager = new ProductManager()
const messageManager = new MessageManager()

// Middleware para manejar las solicitudes JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Directorio estático para archivos públicos
app.use(express.static("public"));

// Guarda las sesiones de los usuarios en Mongo Atlas
app.use(cookieParser());
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: MONGODB_URI,
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedtopology: true,
            },
            ttl:43200,
        }),
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);


// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session())

// Configuración del motor de plantillas Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

// Rutas
app.use("/realtimeproducts", realtimeRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/chat", chatRouter);
app.use("/", loginRouter);
app.use("/signup", signupRouter);
app.use("/api/session/", sessionRouter);
app.use("/forgot", forgotRouter);

// Inicialización del server
const httpServer = app.listen(PORT, (e)=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// WebSockets para la sección de chat y update en tiempo real de productos
const socketServer = new Server(httpServer);

let messages = await messageManager.getMessages() || [];

socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");
    socket.on("addProduct", async newProduct => {
        await productManager.addProduct(newProduct);
        // Agregar el nuevo producto a la lista de productos
        let products = await productManager.getProductsRealtime();
        socket.emit("updateList", products);
    });
    socket.on("deleteProduct", async idProd =>{
        await productManager.deleteProductById(idProd.id);
        let products = await productManager.getProductsRealtime();
        socket.emit("updateList", products);
    })
    socket.on('newUserConnected', user=>{
        socket.broadcast.emit('newUserConnected', user)
    });
    
    socketServer.emit('messageLogs', messages);
    
    socket.on('message', async data =>{
        messages.push(data);
        await messageManager.addMessage(data.user, data.message)
        socketServer.emit('messageLogs', messages)
    });
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});
