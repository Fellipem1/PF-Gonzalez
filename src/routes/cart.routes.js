import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const archivo_carritos = path.join(process.cwd(), 'src/data/cart.js');
const archivo_productos = path.join(process.cwd(), 'src/data/products.js');

const leer_carritos = () => {
  if (!fs.existsSync(archivo_carritos)) return [];
  const data = fs.readFileSync(archivo_carritos, 'utf-8');
  return JSON.parse(data || '[]');
};

const escribir_carritos = (carritos) => {
  fs.writeFileSync(archivo_carritos, JSON.stringify(carritos, null, 2));
};

const leer_productos = () => {
  if (!fs.existsSync(archivo_productos)) return [];
  const data = fs.readFileSync(archivo_productos, 'utf-8');
  return JSON.parse(data || '[]');
};

const generar_id_carrito = (carritos) => {
  if (carritos.length === 0) return '1';
  const max_id = Math.max(...carritos.map(c => parseInt(c.id)));
  return (max_id + 1).toString();
};

router.post('/', (req, res) => {
  const carritos = leer_carritos();
  const nuevo_carrito = { id: generar_id_carrito(carritos), products: [] };

  carritos.push(nuevo_carrito);
  escribir_carritos(carritos);

  res.status(201).json(nuevo_carrito);
});

router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const carritos = leer_carritos();
  const carrito = carritos.find(c => c.id === cid);

  carrito
    ? res.json(carrito.products)
    : res.status(404).json({ error: 'El carrito no fue encontrado.' });
});

router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const carritos = leer_carritos();
  const productos = leer_productos();

  const indice_carrito = carritos.findIndex(c => c.id === cid);
  if (indice_carrito === -1) return res.status(404).json({ error: 'El carrito no fue encontrado.' });

  const producto_existe = productos.some(p => p.id === pid);
  if (!producto_existe) return res.status(404).json({ error: 'El producto no fue encontrado.' });

  const carrito = carritos[indice_carrito];
  const producto_en_carrito = carrito.products.find(p => p.product === pid);

  if (producto_en_carrito) {
    producto_en_carrito.quantity += 1;
  } else {
    carrito.products.push({ product: pid, quantity: 1 });
  }

  escribir_carritos(carritos);
  res.status(200).json(carrito);
});

export default router;
