import React from 'react';

const CategoryTop = ({ image }) => {
  // Extract category and SVG URL from the image object
  const category = image?.category || "Default Category"; // Fallback to "Default Category" if not provided
  const svgUrl = image?.url?.find((url) => url.endsWith('.svg')) || 'https://via.placeholder.com/600x400'; // Fallback to placeholder if no SVG is found

  console.log("Category:", category);
  console.log("SVG URL:", svgUrl);

  return (
    <div className="flex flex-col sm:flex-row w-full h-auto sm:h-96 bg-gray-100 overflow-hidden">
      {/* Left section with text */}
      <div className="w-full sm:w-2/5 flex flex-col sm:justify-center p-8 sm:pl-12 text-left sm:text-center">
        <h1 className="font-serif text-3xl sm:text-5xl text-gray-800 font-normal tracking-wide">{category}</h1>
        <p className="text-gray-700 text-sm sm:text-sm mt-2">Explore our collection of {category}</p>
      </div>
      
      {/* Right section with dynamic SVG image */}
      <div className="sm:w-3/5 h-64 sm:h-full">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${svgUrl})`, // Use the extracted SVG URL or fallback
            backgroundPosition: 'center center'
          }}
        >
          {/* Dynamic image or fallback */}
        </div>
      </div>
    </div>
  );
};

export default CategoryTop;