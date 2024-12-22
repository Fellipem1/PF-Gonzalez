import React from 'react';
import Item from './Item';

const ItemList = ({ products }) => {
  return (
    <div className="row justify-content-center">
      {products.map(product => (
        <div key={product.id} className="col-md-4 mb-3">
          <Item product={product} />
        </div>
      ))}
    </div>
  );
};

export default ItemList;




