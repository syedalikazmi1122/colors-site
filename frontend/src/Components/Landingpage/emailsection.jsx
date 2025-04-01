import React from 'react';


const shopCategories= [
  {
    name: "Beds & Headboards",
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&q=80&w=1600",
    link: "/beds-headboards"
  },
  {
    name: "Dressers & Nightstands",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1600",
    link: "/dressers-nightstands"
  },
  {
    name: "Bedding",
    image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=1600",
    link: "/bedding"
  },
  {
    name: "Bedding",
    image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=1600",
    link: "/bedding"
  },
  {
    name: "Bedding",
    image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=1600",
    link: "/bedding"
  },{
    name: "Bedding",
    image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=1600",
    link: "/bedding"
  },{
    name: "Bedding",
    image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=1600",
    link: "/bedding"
  }
];

export default function ShopByCategory() {
  return (
    <div className='bg-gray-100'>
    <div className=" bg-gray-100 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-serif mb-12 text-gray-900">Shop By Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shopCategories.map((category, index) => (
          <a 
            key={index} 
            href={category.link}
            className="group block"
          >
            <div className="relative aspect-[4/3] overflow-hidden mb-4">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-base text-gray-900 group-hover:text-gray-600 transition-colors duration-200">
              {category.name}
            </h3>
          </a>
        ))}
      </div>
    </div>
    </div>
  );
}