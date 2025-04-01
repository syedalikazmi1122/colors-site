// export default function ThirdSection() {
//     return (
//       <>
//         {/* Customer Testimonials Section */}
//         <div className="bg-white py-12 md:py-24">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* Section Header */}
//             <div className="text-center mb-8 md:mb-12">
//               <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 mb-2 md:mb-4">
//                 real customers, real homes
//               </h2>
//               <p className="text-base md:text-lg text-gray-600 font-serif">
//                 tag us <span className="text-[#B17A63] font-serif">@lovevsdesign</span> and we may feature your home on
//                 our site!
//               </p>
//             </div>
  
//             {/* Testimonial Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
//               {[
//                 {
//                   image:
//                     "https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//                   title: "Sweet Dandelion",
//                   colors: "in custom colors linen & dove",
//                   shared: "shared by @mariangelmellano",
//                 },
//                 {
//                   image:
//                     "https://images.unsplash.com/photo-1616593969747-4797dc75033e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//                   title: "Private Prairie",
//                   colors: "in custom colors silk, salt, & mist",
//                   shared: "shared by @spacelivingrace",
//                 },
//                 {
//                   image:
//                     "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//                   title: "Antique Garden",
//                   colors: "in custom colors rain & earth",
//                   shared: "shared by @lanadmiraks",
//                 },
//                 {
//                   image:
//                     "https://www.decorilla.com/online-decorating/wp-content/uploads/2023/02/White-home-office-inspiration-by-Wanda-P.jpg",
//                   title: "Blossom Orchard",
//                   colors: "in custom colors wheat, laurel, & rosemary",
//                   shared: "shared by @growgardnergrow",
//                 },
//               ].map((testimonial, index) => (
//                 <div key={index} className="bg-[#f5f1ed] flex flex-col">
//                   <div className="aspect-[3/4] overflow-hidden rounded-lg mb-2 md:mb-4">
//                     <img
//                       src={testimonial.image || "/placeholder.svg"}
//                       alt={testimonial.title}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div className="p-3 md:p-4">
//                     <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-1 md:mb-2">{testimonial.title}</h3>
//                     <p className="text-xs md:text-sm text-gray-600 mb-1 font-serif">{testimonial.colors}</p>
//                     <p className="text-xs md:text-sm text-gray-500 font-serif">{testimonial.shared}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </>
//     )
//   }
  
  import React from "react";

  export default function ThirdSection (){
    const categories = [
      {
        name: "All Bedroom",
        image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800",
        link: "/bedroom"
      },
      {
        name: "All Dining Room",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
        link: "/dining-room"
      },
      {
        name: "All Living Room",
        image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
        link: "/living-room"
      },
      {
        name: "All Decor",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
        link: "/decor"
      },
      {
        name: "All Artwork",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
        link: "/artwork"
      },
      {
        name: "All Pillows",
        image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800",
        link: "/pillows"
      },
      {
        name: "All Lighting",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
        link: "/lighting"
      }
    ];
    return(
      <>
       <div className=" px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category, index) => (
              <a 
                key={index} 
                href={category.link}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden mb-3">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif" }} className="text-xs underline text-gray-900 group-hover:underline">
                  {category.name}
                </h3>
              </a>
            ))}
          </div>
        </div>

      
     
      </>
    )
  }