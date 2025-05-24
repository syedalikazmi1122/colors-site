// src/Pages/Checkout/Success.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
// Import your layout components as needed

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // You could fetch the session details from your backend here
      // For now, we'll just simulate success
      setOrderDetails({
        id: sessionId.substring(0, 8),
        date: new Date().toLocaleDateString(),
      });
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 className="text-3xl font-serif mb-2">Thank You For Your Order!</h1>
        <p className="text-gray-600">Your order has been placed and is being processed.</p>
      </div>

      <div className="border p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">Order Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 uppercase text-xs font-semibold">Order Number</p>
            <p>{orderDetails.id}</p>
          </div>
          <div>
            <p className="text-gray-500 uppercase text-xs font-semibold">Date</p>
            <p>{orderDetails.date}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-block bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;