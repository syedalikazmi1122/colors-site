import React from 'react';

const SpringTableTopBanner = () => {
  return (
    <div className="sm:flex w-full h-96 bg-gray-100 overflow-hidden">
      {/* Left section with text */}
      <div className="w-2/5 flex flex-col justify-center pl-12">
        <h1 className="font-serif text-3xl sm:text-5xl text-gray-800   font-normal  tracking-wide">All Tabletop</h1>
        <p className="text-gray-700 text-sm mt-2">Set the table for spring</p>
      </div>
      
      {/* Right section with image */}
      <div className="w-3/5 h-full">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{
            backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2l7d5z1fVVXPDtCBdkt8_tLDdJicyASkLfQ&s')`,
            backgroundPosition: 'center center'
          }}
        >
          {/* This would be replaced with the actual table setting image */}
        </div>
      </div>
    </div>
  );
};

export default SpringTableTopBanner;