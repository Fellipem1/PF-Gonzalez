import express from 'express';
import mongoose from 'mongoose';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/cart.routes.js';
import initializeServer from './js/index.js';
import connectDB from './db.js';

const app = express();


connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


const PORT = 8080;
initializeServer(app, PORT);
