import express from 'express';
import Product from '../data/products.js';

const router = express.Router();


router.get('/', async (req, res) => {
  const { page = 1, limit = 10, sort = '', query = '' } = req.query;

  try {
    const products = await Product.find({ title: { $regex: query, $options: 'i' } })
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort(sort === 'desc' ? { price: -1 } : { price: 1 });

    const count = await Product.countDocuments();
    const totalPages = Math.ceil(count / limit);

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  try {
    const newProduct = new Product({ title, description, code, price, stock, category });
    await newProduct.save();
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
