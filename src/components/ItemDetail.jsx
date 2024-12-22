// src/components/ItemDetail.jsx
import React, { useState, useContext, useEffect } from 'react';
import { ShoppingCartContext } from '../context/ShoppingCart';
import ItemCount from './ItemCount';

const ItemDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(ShoppingCartContext);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  const handleAddToCart = () => {
    if (quantity <= product.quantity) {
      addToCart(product, quantity);
    } else {
      alert('Cantidad no disponible en stock');
    }
  };

  return (
    <div className="container item-detail">
      <h2>Detalles del Producto</h2>
      <div className="item-detail-container">
        <div className="item-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="item-info">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p><strong>Precio: ${product.price}</strong></p>
          <p><strong>Disponibles: {product.quantity}</strong></p>

          <ItemCount 
            quantity={quantity} 
            setQuantity={setQuantity} 
            maxQuantity={product.quantity} 
          />

          <button onClick={handleAddToCart} className="btn btn-primary">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;







