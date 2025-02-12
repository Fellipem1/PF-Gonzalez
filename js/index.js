import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import fs from "fs";

const productsFile = "src/data/products.js"; 

const leerProductos = () => {
  if (!fs.existsSync(productsFile)) return [];
  const data = fs.readFileSync(productsFile, "utf-8");
  return JSON.parse(data || "[]");
};

const guardarProductos = (productos) => {
  fs.writeFileSync(productsFile, JSON.stringify(productos, null, 2));
};

const initializeServer = (app, PORT) => {
  const server = createServer(app);
  const io = new Server(server);

  app.engine("handlebars", engine({
    defaultLayout: "main",
    layoutsDir: path.join(process.cwd(), "src/views/layouts")
  }));
  app.set("view engine", "handlebars");
  app.set("views", path.join(process.cwd(), "src/views"));

  app.use("/views", express.static("src/views"));

  app.get("/home", (req, res) => {
    const products = leerProductos();
    res.render("home", { products });
  });

  app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado");

    socket.emit("productosActualizados", leerProductos());

    socket.on("nuevoProducto", (producto) => {
      const productos = leerProductos();

      delete producto.thumbnails;

      productos.push(producto);
      guardarProductos(productos);
      io.emit("productosActualizados", productos);
    });

    socket.on("eliminarProducto", (id) => {
      let productos = leerProductos();
      productos = productos.filter((p) => p.id !== id);
      guardarProductos(productos);
      io.emit("productosActualizados", productos);
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
