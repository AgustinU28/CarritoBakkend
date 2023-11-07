import express from 'express';
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from "cookie-parser";
import passport from 'passport';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import { __dirname } from './utils.js';

import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import realtimeRouter from './routes/realtimeprods.routes.js';
import chatRouter from './routes/chat.routes.js';
import loginRouter from './routes/login.routes.js';
import sessionRouter from './routes/session.routes.js';
import signupRouter from './routes/signup.routes.js';
import forgotRouter from './routes/forgotPass.routes.js';
import mockingProducts from './routes/mockingProducts.routes.js';
import loggerTest from './routes/loggerTest.routes.js';
import userRoutes from './routes/users.routes.js';
import premiumRouter from './routes/premium.routes.js';

import { ProductManager } from "./dao/dbManagers/DBproductManager.js";
import { MessageManager } from './dao/dbManagers/DBmessageManager.js'; 

import initializePassport from './config/passport.config.js';

import CustomError from './services/errors/customError.js';
import EErrors from './services/errors/enumError.js';
import { generateProductErrorInfo } from './services/errors/errorInfo.js';
import { addLogger } from './services/errors/logger.js';

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
      console.log("Base de datos conectada");
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

// Logger
app.use(addLogger)

// Implementación de SwaggerOptions
const SwaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Documentación del proyecto de tienda TheMarket",
        description: "API para ecommerce donde se puede realizar un CRUD de productos, CRUD de carritos y chat interno",
      },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
  };
//conectamos Swagger
const specs = swaggerJsdoc(SwaggerOptions);

// Rutas
app.use("/", loginRouter);
app.use("/api/session/", sessionRouter);
app.use("/signup", signupRouter);
app.use("/forgot", forgotRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/realtimeproducts", realtimeRouter);
app.use("/chat", chatRouter);
app.use("/mockingproducts", mockingProducts);
app.use("/loggertest", loggerTest);
app.use("/api/users", userRoutes);
app.use("/premium", premiumRouter);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Inicialización del server
const httpServer = app.listen(PORT, (e)=>{
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
});

// WebSockets para la sección de chat y update en tiempo real de productos
const socketServer = new Server(httpServer);

let messages = await messageManager.getMessages() || [];

socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");
    socket.on("addProduct", async newProduct => {
        console.log(newProduct)
        if (newProduct.title.length < 4 || newProduct.description.length < 11) {
            const error = CustomError.createError({
                name : "Error al agregar un producto",
                cause : "Parámetros incompletos o muy cortos",
                message : generateProductErrorInfo(newProduct),
                code : EErrors.INVALID_TYPES_ERROR,
            })
            console.log({error})
        } else{
            await productManager.addProduct(newProduct);
        }
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
        if(!data){
            const error = CustomError.createError({
                name : "Error enviar mensaje",
                cause : "Mensaje vacío",
                code : EErrors.INVALID_TYPES_ERROR,
            })
        } else {            
            messages.push(data);
            await messageManager.addMessage(data.user, data.message)
            socketServer.emit('messageLogs', messages)
        }
    });
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});
