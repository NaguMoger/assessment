import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <nav className="navbar">
            <div className="nav-brand">
              <Link to="/">FoodDelivery</Link>
            </div>
            <div className="nav-links">
              <Link to="/">Menu</Link>
              <Link to="/cart">Cart</Link>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;