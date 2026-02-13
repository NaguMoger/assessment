import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_address: '',
    customer_phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }
    if (!formData.customer_address.trim()) {
      newErrors.customer_address = 'Address is required';
    }
    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone number is required';
    } else if (!/^[\d\s-+()]+$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'Invalid phone number format';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };
      
      const response = await orderService.createOrder(orderData);
      clearCart();
      navigate(`/order-tracking/${response.data.id}`);
    } catch (error) {
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total:</strong>
            <strong>${getCartTotal().toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Delivery Details</h3>
          
          <div className="form-group">
            <label htmlFor="customer_name">Full Name *</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className={errors.customer_name ? 'error' : ''}
            />
            {errors.customer_name && <span className="error-message">{errors.customer_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customer_address">Delivery Address *</label>
            <textarea
              id="customer_address"
              name="customer_address"
              value={formData.customer_address}
              onChange={handleChange}
              className={errors.customer_address ? 'error' : ''}
              rows="3"
            />
            {errors.customer_address && <span className="error-message">{errors.customer_address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customer_phone">Phone Number *</label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              placeholder="e.g., 555-123-4567"
              className={errors.customer_phone ? 'error' : ''}
            />
            {errors.customer_phone && <span className="error-message">{errors.customer_phone}</span>}
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/cart')} className="back-btn">
              Back to Cart
            </button>
            <button type="submit" disabled={loading} className="place-order-btn">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;