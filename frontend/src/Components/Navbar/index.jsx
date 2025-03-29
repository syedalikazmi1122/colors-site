import React, { useState } from 'react';
import { ShoppingCartIcon, UserIcon, HeartIcon, SearchIcon } from 'lucide-react';

const McGeeNavbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  const navItems = [
    'New', 'Wallpaper','Rugs', 'Murals', 'Wall Decor', 
     'Rugs', 'Kids Wallpapers'
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      {/* Top Utility Links */}
      <div className="flex justify-end space-x-6 text-sm bg-slate-50 text-gray-600 p-4 pr-4">
        <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }} className="hover:underline font-medium hover:text-gray-900">Rewards</a>
        <a href="#"  style={{ fontFamily: "Space Grotesk, sans-serif" }}  className="font-medium hover:underline  hover:text-gray-900">Registry</a>
        <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }}  className="font-medium hover:underline hover:text-gray-900">Designer Trade</a>
        <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }}  className="font-medium hover:underline hover:text-gray-900">Gift Card</a>
        <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }}  className="font-medium hover:underline hover:text-gray-900">Track Your Order</a>
        <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }}  className="font-semibold hover:text-gray-900">STUDIO MCGEE</a>
      </div>
      <div className="flex justify-between items-center px-4 py-3">
        {/* Logo */}
     
        {/* Search Area */}
        <div className="flex items-center border-none rounded-md px-3 py-1 w-96">
          <SearchIcon size={20} className="text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="SEARCH" 
            className="w-full outline-none border-none text-sm"
                  />
        </div>

        <div className="text-2xl font-bold">MCGEE & CO.</div>

        {/* Right Icons */}
        <div className="flex space-x-4">
          <button className="text-gray-600 hover:text-black">
            <UserIcon size={20} />
          </button>
          <button className="text-gray-600 hover:text-black">
            <HeartIcon size={20} />
          </button>
          <button className="text-gray-600 hover:text-black">
            <ShoppingCartIcon size={20} />
          </button>
        </div>
      </div>
      <hr className="border-gray-200" />
      {/* Main Navbar */}
      <div className="flex justify-center items-center px-4 py-3">
     
        {/* Navigation Items */}
        <div className="flex space-x-6 overflow-x-auto">
          {navItems.map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-base text-gray-700 hover:text-black whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </div>

      </div>
    </nav>
  );
};

export default McGeeNavbar;