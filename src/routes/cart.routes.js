import express from 'express';
import Cart from '../data/cart.js';

const router = express.Router();


router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const updatedCart = await Cart.findByIdAndUpdate(cid, { $set: { products } }, { new: true }).populate('products');
    res.json({ status: 'success', payload: updatedCart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    const updatedProducts = cart.products.filter(product => product._id.toString() !== pid);
    cart.products = updatedProducts;
    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true }).populate('products');
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
