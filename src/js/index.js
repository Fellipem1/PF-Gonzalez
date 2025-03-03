import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import mongoose from "mongoose";
import Product from "../data/products.js";
import Cart from "../data/cart.js";
import session from "express-session";

const initializeServer = (app, PORT) => {
  const server = createServer(app);
  const io = new Server(server);


  app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));


  app.engine("handlebars", engine({
    defaultLayout: "main",
    layoutsDir: path.join(process.cwd(), "src/views/layouts"),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    }
  }));
  app.set("view engine", "handlebars");
  app.set("views", path.join(process.cwd(), "src/views"));

  app.use("/views", express.static("src/views"));


  const leerProductos = async () => {
    try {
      const productos = await Product.find();
      return productos;
    } catch (err) {
      console.error("Error al obtener productos de la base de datos:", err);
      return [];
    }
  };

  const obtenerCarrito = async (req) => {
    let cartId = req.session.cartId;
  
    if (!cartId) {

      const cart = new Cart();
      await cart.save();
      req.session.cartId = cart._id;
      cartId = cart._id;
    }
  
    return cartId;
  };


  app.get("/home", async (req, res) => {
    const cartId = await obtenerCarrito(req);
    
    const products = await leerProductos();
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
      cartId: cartId ? cartId.toString() : ''
    }));
    
    res.render("home", { products: formattedProducts, cartId: cartId ? cartId.toString() : '' });
  });
  

  app.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
      const product = await Product.findById(pid);

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      const cartId = await obtenerCarrito(req);

      res.render("productDetails", { product, cartId });
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res.status(500).json({ message: "Error al obtener el producto" });
    }
  });

  app.post("/api/carts/:cartId/products/:productId", async (req, res) => {
    const { cartId, productId } = req.params;

    try {

      const cart = await Cart.findById(cartId);

      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }


      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }


      const productInCart = cart.products.find(p => p.product.toString() === productId);

      if (productInCart) {

        productInCart.quantity += 1;
      } else {

        cart.products.push({ product: product._id, quantity: 1 });
      }

      await cart.save();


      res.redirect(`/carts/${cartId}`);
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      res.status(500).json({ message: "Error al agregar el producto al carrito" });
    }
  });


  app.get("/carts/:cartId", async (req, res) => {
    const { cartId } = req.params;

    try {

      const cart = await Cart.findById(cartId).populate({
        path: 'products.product',
        model: 'Product',
      });

      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }


      console.log("Productos en el carrito:", cart.products);


      res.render("cartDetails", { cart });
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ message: "Error al obtener el carrito" });
    }
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado");

    socket.emit("productosActualizados", leerProductos());

    socket.on("nuevoProducto", async (producto) => {
      try {
        const nuevoProducto = new Product(producto);
        await nuevoProducto.save();

        io.emit("productosActualizados", await leerProductos());
      } catch (err) {
        console.error("Error al agregar un producto:", err);
      }
    });

    socket.on("eliminarProducto", async (id) => {
      try {
        await Product.deleteOne({ _id: id });
        io.emit("productosActualizados", await leerProductos());
      } catch (err) {
        console.error("Error al eliminar producto:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });
  });

  server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
};

export default initializeServer;






