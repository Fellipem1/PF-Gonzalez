import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const archivo_productos = path.join(process.cwd(), 'src/data/products.js');

const leer_productos = () => {
  if (!fs.existsSync(archivo_productos)) return [];
  const data = fs.readFileSync(archivo_productos, 'utf-8');
  return JSON.parse(data || '[]');
};

const escribir_productos = (productos) => {
  fs.writeFileSync(archivo_productos, JSON.stringify(productos, null, 2));
};

const generar_id_producto = (productos) => {
  if (productos.length === 0) return '1';
  const max_id = Math.max(...productos.map(p => parseInt(p.id)));
  return (max_id + 1).toString();
};

router.get('/', (req, res) => {
  const productos = leer_productos();
  const limite = parseInt(req.query.limit);
  res.json(limite ? productos.slice(0, limite) : productos);
});

router.get('/:id', (req, res) => {
  const productos = leer_productos();
  const producto = productos.find(p => p.id === req.params.id);
  producto
    ? res.json(producto)
    : res.status(404).json({ error: 'El producto no fue encontrado.' });
});

router.post('/', (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails.' });
  }

  const productos = leer_productos();
  const nuevo_producto = {
    id: generar_id_producto(productos),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };

  productos.push(nuevo_producto);
  escribir_productos(productos);
  res.status(201).json(nuevo_producto);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const productos = leer_productos();
  const indice_producto = productos.findIndex(p => p.id === id);

  if (indice_producto === -1) {
    return res.status(404).json({ error: 'El producto no fue encontrado.' });
  }

  const producto_actualizado = { ...productos[indice_producto], ...req.body };
  delete producto_actualizado.id;

  productos[indice_producto] = { ...productos[indice_producto], ...producto_actualizado };
  escribir_productos(productos);

  res.json(productos[indice_producto]);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let productos = leer_productos();

  if (!productos.some(p => p.id === id)) {
    return res.status(404).json({ error: 'El producto no fue encontrado.' });
  }

  productos = productos.filter(p => p.id !== id);
  escribir_productos(productos);
  
  res.status(200).json({ mensaje: 'El producto fue eliminado correctamente.' });
});

export default router;
