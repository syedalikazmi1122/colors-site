"use client";

import { useState } from "react";
import { Instagram } from "lucide-react";
import Image10 from "./../../../src/Assets/10.jpg";
import Image11 from "./../../../src/Assets/12.jpg";
import Image12 from "./../../../src/Assets/13.jpg";
import Image14 from "./../../../src/Assets/14.jpg";
import Image15 from "./../../../src/Assets/15.jpg";
import Image16 from "./../../../src/Assets/16.jpg";

const InstagramShop = () => {
  const [email, setEmail] = useState("");

  const instagramImages = [
  Image10,
  Image11,
  Image12,
  Image14,
  Image15,
  Image16
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
  };

  return (
    <div className="bg-white py-10 md:py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {/* Instagram Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-lg sm:text-xl md:text-xl text-gray-800 font-serif">
            Follow Along
          </h2>
          <p className="mt-2 md:mt-4 text-sm md:text-base text-gray-600 font-serif">
            @lovessdesign
          </p>
        </div>

        {/* Instagram Images Grid - responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
  {instagramImages.map((image, index) => (
    <div
      key={index}
      className="relative overflow-hidden group cursor-pointer h-64" // Increased height for vertical cards
    >
      {/* Image */}
      <img
        src={image || "/placeholder.svg"}
        alt={`Instagram post ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay with Instagram Logo */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
        <Instagram className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300" />
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
};

export default InstagramShop;

