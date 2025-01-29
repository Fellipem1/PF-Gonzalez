import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/cart.routes.js";

const app = express();
app.use(express.json());

const PORT = 8080;


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
