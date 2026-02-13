import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/api';
import './OrderTracking.css';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
    // Set up EventSource for real-time updates
    const eventSource = new EventSource(`http://localhost:5000/api/orders/${orderId}/status-stream`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOrder(prevOrder => ({
        ...prevOrder,
        status: data.status
      }));
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrder(orderId);
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      setError('Order not found');
      setLoading(false);
    }
  };

  const simulateProgress = async () => {
    try {
      const response = await orderService.simulateProgress(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error('Failed to simulate progress:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Order Received': return '📥';
      case 'Preparing': return '👨‍🍳';
      case 'Out for Delivery': return '🛵';
      case 'Delivered': return '✅';
      default: return '⏳';
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return null;

  return (
    <div className="tracking-container">
      <div className="order-header">
        <h2>Order #{order.id}</h2>
        <div className="status-badge">
          {getStatusIcon(order.status)} {order.status}
        </div>
      </div>

      <div className="status-timeline">
        {['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'].map((status, index) => (
          <div key={status} className={`timeline-item ${order.status === status ? 'active' : ''} ${order.status === status ? 'current' : ''}`}>
            <div className="timeline-icon">{getStatusIcon(status)}</div>
            <div className="timeline-content">
              <h4>{status}</h4>
              {order.status === status && <span className="current-label">Current</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="order-details">
        <div className="details-section">
          <h3>Delivery Details</h3>
          <p><strong>Name:</strong> {order.customer_name}</p>
          <p><strong>Address:</strong> {order.customer_address}</p>
          <p><strong>Phone:</strong> {order.customer_phone}</p>
        </div>

        <div className="details-section">
          <h3>Order Items</h3>
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-total">
            <strong>Total:</strong>
            <strong>${order.total_amount.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {order.status !== 'Delivered' && (
        <button onClick={simulateProgress} className="simulate-btn">
          Simulate Next Status
        </button>
      )}
    </div>
  );
};

export default OrderTracking;