import Image1 from "./../../../src/Assets/banner.jpg"
import React from "react";

export default function BedroomSaleSection() {
  return (
    <div className="relative h-[600px] w-full">
      {/* Background Image (Bedroom Scene) */}
      <div 
        className="absolute inset-0  bg-cover bg-center"
        style={{
          backgroundImage: `url(${Image1})`, // Use the imported image
         }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-30"></div>

      {/* Sale Text Content */}
      <div className="relative z-10 h-full flex p-10 justify-end  ">
        <div className="text-right pr-20">
          <h2 className="text-4xl sm:text-6xl font-medium tracking-wide text-white mb-4">
            UP TO 25% OFF
          </h2>
          <h3 className="text-2xl sm:text-4xl  tracking-wide text-white mb-4">
       On All Designs
          </h3>
       
{/*           
          <button className="bg-white text-black px-8 py-3 border border-gray-300 hover:bg-gray-100 transition-colors">
            SHOP THE SALE
          </button> */}
        </div>
      </div>
    </div>
  );
}