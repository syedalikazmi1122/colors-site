// import React from "react";
// import { Heart } from 'lucide-react';

// export default function TopSection() {
//     return (
//         <>
//             {/* Hero Section */}
//             <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-40 relative h-[400px] md:h-[500px] lg:h-[600px]">
//                 {/* Background Image */}
//                 <div
//                     className="absolute inset-0 bg-cover bg-center"
//                     style={{
//                         backgroundImage: 'url("https://5.imimg.com/data5/GR/BC/JZ/SELLER-49282358/wallpaper-roll-500x500.jpg")'
//                     }}
//                 >
//                     {/* Overlay */}
//                     <div className="absolute inset-0 bg-black bg-opacity-20"></div>
//                 </div>

//                 {/* Content */}
//                 <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
//                     {/* Logo */}
//                     <div className="mb-2 md:mb-4">
//                         <Heart className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 mx-auto" />
//                     </div>

//                     {/* Text Content */}
//                     <div className="max-w-4xl mx-auto">
//                         <p className="text-lg md:text-xl lg:text-2xl mb-2 md:mb-4 font-light font-serif">custom color</p>
//                         <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif mb-2 md:mb-4">WALLPAPER</h1>
//                         <p className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-8 font-light font-serif">match your unique decor and style.</p>

//                         {/* CTA Button */}
//                         <button className="bg-emerald-700 hover:bg-[#297e52] text-white px-6 py-2 md:px-8 md:py-3 rounded transition-colors duration-300 font-serif">
//                             SHOP NOW
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }



import React from "react";

export default function BedroomSaleSection() {
  return (
    <div className="relative h-[600px] w-full">
      {/* Background Image (Bedroom Scene) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://5.imimg.com/data5/GR/BC/JZ/SELLER-49282358/wallpaper-roll-500x500.jpg")',
          backgroundImage: 'url("https://5.imimg.com/data5/GR/BC/JZ/SELLER-49282358/wallpaper-roll-500x500.jpg")'
        }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-30"></div>

      {/* Sale Text Content */}
      <div className="relative z-10 h-full flex p-10 justify-end  ">
        <div className="text-right pr-20">
          <h2 className="text-4xl font-medium tracking-wide text-gray-800 mb-4">
            UP TO 25% OFF
          </h2>
          <h3 className="text-2xl  tracking-wide text-gray-800 mb-4">
       On All Designs
          </h3>
       
          
          <button className="bg-white text-black px-8 py-3 border border-gray-300 hover:bg-gray-100 transition-colors">
            SHOP THE SALE
          </button>
        </div>
      </div>
    </div>
  );
}