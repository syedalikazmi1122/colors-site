import React from 'react';

const SpringTableTopBanner = () => {
  return (
    <div className="flex flex-col sm:flex-row w-full h-auto sm:h-96 bg-gray-100 overflow-hidden">
      {/* Left section with text */}
      <div className="w-full sm:w-2/5 flex flex-col sm:justify-center p-8 sm:pl-12 text-left sm:text-center">
        <h1 className="font-serif text-3xl sm:text-5xl text-gray-800 font-normal tracking-wide">All Tabletop</h1>
        <p className="text-gray-700 text-sm sm:text-sm mt-2">Set the table for spring</p>
      </div>
      
      {/* Right section with image */}
      <div className=" sm:w-3/5 h-64 sm:h-full">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2l7d5z1fVVXPDtCBdkt8_tLDdJicyASkLfQ&s')`, // Using a placeholder image
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