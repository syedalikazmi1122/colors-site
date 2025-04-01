import React, { useState } from 'react';
import Footer from '../../Components/Landingpage/footer';
import Navbar from '../../Components/Navbar';

export function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-2">Login</h1>
          <p className="text-gray-600 text-sm">
            Enter your email and password to login:
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-mail"
                required
                className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
              />
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
              />
              <a 
                href="#" 
                className="absolute right-0 top-1/2 -translate-y-1/2 mr-3 text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              LOGIN
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              New to McGee & Co.?{' '}
              <a href="#" className="text-gray-900 hover:underline">
                Start Here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
}