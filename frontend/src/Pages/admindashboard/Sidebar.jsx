import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Package,
  Tag,
  Users,
  ShoppingCart,
  Settings,
  CreditCard,
  HelpCircle,
  BarChart3,
  X
} from 'lucide-react';



const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
   ];

  return (
    <>
      {/* Sidebar Overlay - Mobile Only */}
      <div 
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-serif">SVG Admin</h1>
          <button 
            className="text-gray-400 hover:text-white lg:hidden" 
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                    ${isActive || item.active 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;