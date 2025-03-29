// import React from "react";

// export default function SecondSection() {
//   return (
//     <>
//       {/* Materials Section */}
//       <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-40 mt-10 md:mt-20 px-4 sm:px-6 bg-gray-100 lg:px-8 py-12 md:py-24">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
//           <div>
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-2 md:mb-4 font-serif">
//               removeable
//             </h2>
//             <h3 className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-4 md:mb-6 font-serif">
//               MATERIALS
//             </h3>
//             <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 font-serif">
//               All of our materials are damage-free and easy to remove. Order
//               custom color samples today to test our materials in person.
//             </p>
//           </div>

//           {/* Right Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8">
//             {/* Material Cards */}
//             {[
//               {
//                 image:
//                   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9Nl15qF4b8TQ9c-aalC3QJDRjRD4lIg7WA&s",
//                 title: "GLISSADE PAPER",
//               },
//               {
//                 image:
//                   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcLzjlY-YkP5A3Yr96mlpoKNYGATCj_4ZoLw&s",
//                 title: "SMOOTH VINYL",
//               },
//               {
//                 image:
//                   "https://img.pikbest.com/wp/202408/woven-fabric-close-up-of-cloth-white-wool-texture-with-knitted-detail_9910674.jpg!w700wp",
//                 title: "WOVEN FABRIC",
//               },
//               {
//                 image:
//                   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvZhSpicZtFB-TTE9iFkNtrAT_jVjJssM6CA&s",
//                 title: "GRASSCLOTH VINYL",
//               },
//             ].map((material, index) => (
//               <div key={index} className="flex flex-col">
//                 <div className="aspect-square overflow-hidden bg-gray-100 rounded-lg mb-2 md:mb-4">
//                   <img
//                     src={material.image || "/placeholder.svg"}
//                     alt={material.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <h4 className="text-xs sm:text-sm font-medium text-gray-900 text-center font-serif">
//                   {material.title}
//                 </h4>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React from 'react';



const furnitureItems = [
  {
    name: "Taylor Pleated Bed (Ready to Ship)",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
    currentPrice: 1416.75,
    originalPrice: 1889.00,
    discount: "25% off",
    prefix: "From"
  },
  {
    name: "Alessandra Dresser",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800",
    currentPrice: 2520.00,
    originalPrice: 3360.00,
    discount: "25% off"
  },
  {
    name: "Alessandra Nightstand",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800",
    currentPrice: 866.25,
    originalPrice: 1155.00,
    discount: "25% off"
  },
  {
    name: "Serena Wood Lounge Chair",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
    currentPrice: 1143.75,
    originalPrice: 1525.00,
    discount: "25% off"
  }
];

function App() {
  return (
    <div className="mb-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif text-center mb-12 text-gray-900">All Wallpapers</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {furnitureItems.map((item, index) => (
            <div key={index} className="group">
              <div className="relative mb-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full aspect-[4/3] object-cover object-center bg-gray-100"
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
          ))}
        </div>
      </div>
      {/* view all button */}
      <div className="flex justify-center mt-8">
        <button className="bg-black text-white px-6 py-3 shadow-md hover:bg-gray-800 transition-colors duration-200">
          VIEW ALL
        </button>
      </div>
      <div className="fixed bottom-8 right-8">
        <button 
          className="bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-200"
          aria-label="Chat with us"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="block w-3 h-3 bg-white rounded-full"></span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default App;