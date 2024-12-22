import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ShoppingCartContext } from '../context/ShoppingCart';

function Checkout() {
  const { cartItems, removeFromCart } = useContext(ShoppingCartContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    company: ''
  });
  const [formError, setFormError] = useState({});
  const [orderID, setOrderID] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = 'El nombre es obligatorio.';
    if (!formData.lastName.trim()) errors.lastName = 'El apellido es obligatorio.';
    if (!formData.email.trim()) errors.email = 'El email es obligatorio.';
    if (formData.email !== formData.confirmEmail) {
      errors.confirmEmail = 'Los emails no coinciden.';
    }
    if (!formData.company.trim()) errors.company = 'La empresa es obligatoria.';

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const order = {
        buyer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          company: formData.company,
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: calculateTotal(),
        date: new Date(),
      };

      const docRef = await addDoc(collection(db, 'ordenes'), order);
      setOrderID(docRef.id);
      setSuccessMessage('¡Felicidades la compra se realizo con éxito!');
    } catch (error) {
      console.error('Error al procesar la orden:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout">
      <h2>Carrito de Compras</h2>

      {cartItems.length === 0 ? (
        <div>
          <p>No hay productos en tu carrito.</p>
          <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
        </div>
      ) : (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <div>{item.name}</div>
                <div>Cantidad: {item.quantity}</div>
                <div>Precio: ${item.price}</div>
                <div>Total: ${item.price * item.quantity}</div>
                <button onClick={() => removeFromCart(item.id)} className="btn btn-danger">Eliminar</button>
              </li>
            ))}
          </ul>

          <div className="total">
            <strong>Total: ${calculateTotal()}</strong>
          </div>

          {!successMessage && (
            <form onSubmit={handleSubmit} className="checkout-form">
              <h3>Formulario de Compra</h3>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {formError.firstName && <p className="error">{formError.firstName}</p>}
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {formError.lastName && <p className="error">{formError.lastName}</p>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {formError.email && <p className="error">{formError.email}</p>}
              </div>
              <div className="form-group">
                <label>Confirmar Email</label>
                <input
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {formError.confirmEmail && <p className="error">{formError.confirmEmail}</p>}
              </div>
              <div className="form-group">
                <label>Empresa</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {formError.company && <p className="error">{formError.company}</p>}
              </div>
              <button type="submit" className="btn btn-success" disabled={isLoading}>
                {isLoading ? 'Procesando...' : 'Confirmar Compra'}
              </button>
            </form>
          )}
        </div>
      )}

      {successMessage && (
        <div>
          <h3>{successMessage}</h3>
          <div className="brief">
            <h3>Resumen del Pedido</h3>
            <p><strong>ID de la Orden:</strong> {orderID}</p>
            <p><strong>Productos en el carrito:</strong> {cartItems.length} producto(s) comprado.</p>
            <p><strong>Total de la compra:</strong> ${calculateTotal()}</p>
          </div>
          <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
        </div>
      )}
    </div>
  );
}

export default Checkout;















