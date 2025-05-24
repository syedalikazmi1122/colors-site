// src/Pages/Checkout/Cancel.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Import your layout components as needed

const CheckoutCancel = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h1 className="text-3xl font-serif mb-2">Order Cancelled</h1>
        <p className="text-gray-600">Your checkout process was cancelled. Your cart items are still saved.</p>
      </div>

      <div className="text-center">
        <Link
          to="/cart"
          className="inline-block bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors"
        >
          Return to Cart
        </Link>
      </div>
    </div>
  );
};

export default CheckoutCancel;