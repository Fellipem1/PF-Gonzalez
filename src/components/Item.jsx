import React from 'react';
import { useNavigate } from 'react-router-dom';

const Item = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ width: '18rem' }}>
      <img src={product.image} className="card-img-top" alt={product.name} />
      <div className="card-body text-center">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p><strong>Precio: ${product.price}</strong></p>
        <button onClick={() => navigate(`/item/${product.id}`)} className="btn btn-primary">
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default Item;
