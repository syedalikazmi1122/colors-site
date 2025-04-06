import React, { useState } from 'react';
import Footer from '../../Components/Footer';
import Navbar from '../../Components/Navbar';
import sendRequest from '../../Utils/apirequest';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validate first and last name
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First and last name are required.');
      return false;
    }

    // Validate name format and allow spaces too
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      toast.error('First and last name can only contain letters and spaces.');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Combine first and last name
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    // Prepare data to send to the backend
    const dataToSend = {
      name: fullName,
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await sendRequest('POST', '/signup', dataToSend);
      if (response.status === 200) {
        toast.success('Signup successful!');
        // Optionally, redirect to login or another page
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup. Please try again.');
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
            <h1 className="text-4xl font-serif mb-2">Create Account</h1>
            <p className="text-gray-600 text-sm">
              Join McGee & Co. to start shopping our curated collection
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
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

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'} // Toggle input type
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirm password visibility
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-3 text-gray-600 hover:text-gray-900"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              >
                CREATE ACCOUNT
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-gray-900 hover:underline">
                  Login
                </a>
              </p>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>
                By creating an account, you agree to McGee & Co.'s{' '}
                <a href="#" className="underline hover:text-gray-700">Privacy Policy</a>
                {' '}and{' '}
                <a href="#" className="underline hover:text-gray-700">Terms of Service</a>
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