import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartContext } from '../context/ShoppingCart';

const CartWidget = () => {
  const { getTotalItems } = useContext(ShoppingCartContext);

  return (
    <div className="cart-widget">
      <Link to="/checkout">
        <img src="/images/cart.svg" alt="Carrito" className="cart-icon" />
      </Link>
      {getTotalItems() > 0 && <span className="cart-count">{getTotalItems()}</span>}
    </div>
  );
};

export default CartWidget;












