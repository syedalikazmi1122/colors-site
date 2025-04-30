import React from "react";
import { Link } from "react-router-dom";

export default function TopSection({ TopSectionData }) {
  // If no banners are available, show a default banner
  const defaultBanner = {
    url: ["/banner.jpg"],
    title: "UP TO 25% OFF",
    subtitle: "On All Designs"
  };

  const banner = TopSectionData.length > 0 ? TopSectionData[0] : defaultBanner;

  return (
    <div className="relative h-[600px] w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${banner.url[0]})`,
        }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-30"></div>

      {/* Sale Text Content */}
      <div className="relative z-10 h-full flex p-10 justify-end">
        <div className="text-right pr-20">
          <h2 className="text-4xl sm:text-6xl font-medium tracking-wide text-white mb-4">
            {banner.title}
          </h2>
          <h3 className="text-2xl sm:text-4xl tracking-wide text-white mb-4">
            {banner.subtitle}
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