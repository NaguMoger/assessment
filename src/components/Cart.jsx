import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getItemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Add some delicious items from our menu!</p>
        <button onClick={() => navigate('/')}>Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart ({getItemCount()} items)</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image_url} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            <div className="cart-item-total">
              <p>${(item.price * item.quantity).toFixed(2)}</p>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <button onClick={handleCheckout} className="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;