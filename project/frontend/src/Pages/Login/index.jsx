import React, { useState } from 'react';
import Footer from '../../Components/Footer';
import Navbar from '../../Components/Navbar';
import sendRequest from '../../Utils/apirequest';
import toast, { Toaster } from 'react-hot-toast';
import useProfileAuthStore from '../../Zustand/profileAuthStore';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const setUser = useProfileAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate email and password
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Email and password are required.');
      return;
    }
  
    try {
      const response = await sendRequest('POST', '/login', formData);
  
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        toast.success('Login successful!');
  
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
  
        // Extract user data from response
        const user = response.data.user;
    console.log('User data:', user);
        // Set user in Zustand store
        setUser(user);
    console.log("user role", user.role);
        // Navigate based on user role
        if (response.data.user.role && response.data.user.role.toLowerCase() === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/profile');
        }
      } else {
        toast.error('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    }
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
                  type={showPassword ? 'text' : 'password'} // Toggle input type
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-3 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
                New to  <strong>FABB HOME AND LIVING? </strong> {' '}
                <a href="/signup" className="text-gray-900 hover:underline">
                  Start Here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <Toaster />
    </>
  );
}