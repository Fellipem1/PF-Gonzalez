import React from 'react';

const ItemCount = ({ quantity, setQuantity, maxQuantity }) => {

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, parseInt(e.target.value, 10));
    if (newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="item-quantity-selector">
      <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</button>
      <input
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        min="1"
        max={maxQuantity}
      />
      <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= maxQuantity}>+</button>
    </div>
  );
};

export default ItemCount;
