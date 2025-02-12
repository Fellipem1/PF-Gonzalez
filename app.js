import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/cart.routes.js";
import initializeServer from "./js/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

initializeServer(app, PORT);






