import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Colors
        </Link>
        
        <div className="navbar-right">
        
          <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
            <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'} />
          </div>

          <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-links" onClick={() => setIsOpen(false)}>
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-links" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-links" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 