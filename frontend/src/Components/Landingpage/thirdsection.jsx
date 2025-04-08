
  
  import React from "react";
import Image7 from "./../../../src/Assets/7.jpg"
import Image8 from "./../../../src/Assets/8.jpg"
import Image9 from "./../../../src/Assets/9.jpg"
import Image10 from "./../../../src/Assets/10.jpg"
import Image11 from "./../../../src/Assets/12.jpg"
import Image12 from "./../../../src/Assets/13.jpg"
  export default function ThirdSection (){
    const categories = [
      {
      name: "All Bedroom",
      image: Image7,
      link: "/bedroom"
      },
      {
      name: "All Dining Room",
      image: Image8,
      link: "/dining-room"
      },
      {
      name: "All Living Room",
      image: Image9,
      link: "/living-room"
      },
      {
      name: "All Decor",
      image: Image10,
      link: "/decor"
      },
      {
      name: "All Artwork",
      image: Image11,
      link: "/artwork"
      },
      {
      name: "All Pillows",
      image: Image12,
      link: "/pillows"
      },
      {
      name: "All Lighting",
      image: Image7,
      link: "/lighting"
      }
    ];
    return(
      <>
       <div className=" px-4 sm:px-20">
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