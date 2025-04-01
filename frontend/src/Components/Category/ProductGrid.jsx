import React from 'react';

const products = [
  {
    id: 1,
    name: "Amberly Woven Placemat",
    price: 28.00,
    image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&q=80&w=800",
    isNew: true
  },
  {
    id: 2,
    name: "Felix Plaid Tablecloth",
    price: 159.00,
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800",
    isNew: true
  },
  {
    id: 3,
    name: "Kittredge Napkins (Set of 4)",
    price: 66.00,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800",
    isNew: true
  },
  {
    id: 4,
    name: "Aiden Soft Gray Mug",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    isNew: true
  },
  {
    id: 5,
    name:"kiyysgr htsu",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    isNew: true 
  },
    {
    id: 6,
    name:"kiyysgr htsu",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    isNew: true
    },
        {
    id: 7,
    name:"kiyysgr htsu",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    isNew: true
    },
            {
    id: 8,
    name:"kiyysgr htsu",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    isNew: true
    },
                    {
    id: 9,
    name:"kiyysgr htsu",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    isNew: true
    },
                        {
    id: 10,
    name:"kiyysgr htsu",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    isNew: true
    },
                            {
    id: 11,
    name:"kiyysgr htsu",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    isNew: true
    },
];

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
      {products.map((product) => (
        <div key={product.id} className="group">
          <div className="relative mb-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full aspect-square object-cover rounded-sm"
            />
            {product.isNew && (
              <div className="absolute top-2 left-2">
                <span className="bg-gray-100 text-gray-900 text-xs px-2 py-1 rounded">
                  New
                </span>
              </div>
            )}
          </div>
          <h3 className="text-sm text-gray-900 group-hover:text-gray-600 transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-sm text-gray-900 mt-1">
            ${product.price.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}