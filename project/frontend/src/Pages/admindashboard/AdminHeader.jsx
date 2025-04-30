import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from './../../Zustand/profileAuthStore'; // Import Zustand store

const AdminHeader = ({ toggleSidebar, sidebarOpen, userData }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout); // Access the logout function from Zustand

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    logout(); // Call the Zustand logout function
    toast.success('Logged out successfully');
    navigate('/login'); // Redirect to login page
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-40 h-16 flex items-center justify-between px-4 md:px-6 lg:pl-0">
      <div className="flex items-center">
        <button 
          className="text-gray-600 hover:text-gray-900 lg:hidden" 
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu size={22} />
        </button>
        <span className="text-xl font-serif ml-4 lg:hidden">Admin Dashboard</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-4 ml-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {userData?.image ? (
              <img src={userData.image} alt="User" className="h-full w-full object-cover" />
            ) : (
              <span className="text-gray-600 font-medium">{userData?.name?.charAt(0) || 'A'}</span>
            )}
          </div>
          
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{userData?.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500">{userData?.email || 'admin@gmail.com'}</p>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden md:inline ml-2">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;