import React, { useState, useEffect } from 'react';
import { menuService } from '../services/api';
import { useCart } from '../context/CartContext';
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await menuService.getMenu();
      setMenuItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load menu');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="menu-container">
      <h2>Our Menu</h2>
      <div className="menu-grid">
        {menuItems.map(item => (
          <div key={item.id} className="menu-item">
            <img src={item.image_url} alt={item.name} className="item-image" />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="description">{item.description}</p>
              <p className="price">${item.price.toFixed(2)}</p>
              <button 
                onClick={() => addToCart(item)}
                className="add-to-cart-btn"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;