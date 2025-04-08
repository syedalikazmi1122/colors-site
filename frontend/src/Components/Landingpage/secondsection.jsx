import React, { useRef } from 'react';

import Image1 from "./../../../src/Assets/1.jpg";
import Image2 from "./../../../src/Assets/2.jpg";
import Image3 from "./../../../src/Assets/3.jpg";
import Image4 from "./../../../src/Assets/4.jpg";
import Image5 from "./../../../src/Assets/5.jpg";
import Image6 from "./../../../src/Assets/6.jpg";
const furnitureItems = [
  {
    name: "Taylor Pleated Bed (Ready to Ship)",
    image: Image1,
    currentPrice: 1416.75,
    originalPrice: 1889.00,
    discount: "25% off",
    prefix: "From"
  },
  {
    name: "Alessandra Dresser",
    image: Image2,
    currentPrice: 2520.00,
    originalPrice: 3360.00,
    discount: "25% off"
  },
  {
    name: "Alessandra Nightstand",
    image: Image3,
    currentPrice: 866.25,
    originalPrice: 1155.00,
    discount: "25% off"
  },
  {
    name: "Serena Wood Lounge Chair",
    image: Image5,
    currentPrice: 1143.75,
    originalPrice: 1525.00,
    discount: "25% off"
  },
  {
    name: "Modern Platform Bed",
    image: Image4,
    currentPrice: 1299.99,
    originalPrice: 1699.99,
    discount: "24% off"
  },
 
  {
    name: "Mid-Century Console",
    image: Image6,
    currentPrice: 849.75,
    originalPrice: 1133.00,
    discount: "25% off"
  }
];

function App() {
  const scrollContainerRef = useRef(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif text-center mb-8 text-gray-900">All Wallpapers</h1>
        
        <div className="relative">
          {/* Left Scroll Button */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {furnitureItems.map((item, index) => (
              <div key={index} className="flex-none w-64 mx-3 snap-start">
                <div className="group">
                  <div className="relative mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full aspect-[4/3] object-cover object-center bg-gray-100 rounded"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-[15px] leading-tight text-gray-900 hover:text-gray-600 transition-colors duration-200">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap items-baseline gap-x-1.5 text-[13px]">
                      {item.prefix && (
                        <span className="text-gray-900">From</span>
                      )}
                      <span className="text-red-600 font-medium">
                        ${item.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-500 line-through">
                        ${item.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-500">({item.discount})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Scroll Button */}
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* View all button */}
      <div className="flex justify-center mt-4">
        <button className="bg-black text-white px-6 py-3 shadow-md hover:bg-gray-800 transition-colors duration-200">
          VIEW ALL
        </button>
      </div>
    </div>
  );
}

export default App;