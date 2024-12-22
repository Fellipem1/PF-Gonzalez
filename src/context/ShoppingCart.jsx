import { createContext, useState } from 'react';


export const ShoppingCartContext = createContext();


export const ShoppingCartProvider = ({ children }) => {
  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  };

  const [cartItems, setCartItems] = useState(loadCartFromLocalStorage);

  const addToCart = (item, quantity) => {
    const quantityNumber = parseInt(quantity, 10);
    setCartItems(prevItems => {
      const updatedCartItems = prevItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantityNumber }
          : cartItem
      );
      if (!prevItems.some(cartItem => cartItem.id === item.id)) {
        updatedCartItems.push({ ...item, quantity: quantityNumber });
      }
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const updatedCartItems = prevItems.filter(item => item.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <ShoppingCartContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalItems }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};









