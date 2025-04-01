import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Landingpage/footer';



const colorCategories = [
  {
    name: 'Background',
    options: [
      { name: 'sage', label: 'Sage', color: '#8BA89B' },
      { name: 'white', label: 'White', color: '#FFFFFF' },
      { name: 'black', label: 'Black', color: '#000000' },
      
    ]
  },
  {
    name: 'Large Berries',
    options: [
      { name: 'blue', label: 'Ocean Blue', color: '#4A7081' },
      { name: 'dusty-blue', label: 'Dusty Blue', color: '#92A5B2' },
    ]
  },
  {
    name: 'Large Flowers',
    options: [
      { name: 'light-blue', label: 'Sky Blue', color: '#B8D0D8' },
      { name: 'cream', label: 'Cream', color: '#F5E6D3' },
    ]
  },
  {
    name: 'Leaves',
    options: [
      { name: 'sage-light', label: 'Light Sage', color: '#D1D9D1' },
      { name: 'olive', label: 'Olive', color: '#8B9A7A' },
    ]
  },
];

const similarProducts = [
  {
    id: 1,
    name: "Botanical Garden Wallpaper",
    price: 189.00,
    image: "https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    name: "Vintage Floral Pattern",
    price: 169.00,
    image: "https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    name: "Modern Abstract Flowers",
    price: 209.00,
    image: "https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    name: "Spring Blossom Design",
    price: 179.00,
    image: "https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?auto=format&fit=crop&q=80&w=800",
  }
];

export function ProductInfo() {
  const [selectedColors, setSelectedColors] = useState({});
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleColorSelect = (category, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [category]: color
    }));
  };

  return (
    <>
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <img 
            src="https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?auto=format&fit=crop&q=80&w=800" 
            alt="Floral Abundance Wallpaper"
            className="w-full rounded-sm"
          />
        </div>

        {/* Product Details */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-serif">floral abundance</h1>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5"
                    fill={star <= 4 ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <a href="#reviews" className="text-sm text-gray-600 hover:underline">
                read reviews
              </a>
            </div>
          </div>

          <p className="text-lg mb-8">Wallpaper</p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl mb-4">pick your custom colors:</h2>
              <div className="grid grid-cols-7 gap-4">
                {colorCategories.map((category) => (
                  <div key={category.name} className="text-center">
                    <button
                      onClick={() => {
                        setIsColorPickerOpen(true);
                        setActiveCategory(category.name);
                      }}
                      className="w-16 h-16 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200"
                      style={{
                        backgroundColor: selectedColors[category.name]?.color || '#FFFFFF'
                      }}
                    />
                    <p className="text-sm mt-2">{category.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors">
                ORDER $6 SAMPLE
              </button>
              <button className="px-6 py-2 bg-rose-700 text-white hover:bg-rose-800 transition-colors">
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-24">
        <h2 className="text-2xl font-serif mb-8">Similar Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
              <h3 className="text-lg font-medium mb-2">{product.name}</h3>
              <p className="text-gray-900">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Color Picker Modal */}
      {isColorPickerOpen && activeCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Select {activeCategory} Color</h3>
              <button 
                onClick={() => setIsColorPickerOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {colorCategories.find(cat => cat.name === activeCategory)?.options.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    handleColorSelect(activeCategory, color);
                    setIsColorPickerOpen(false);
                  }}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded"
                >
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-200"
                    style={{ backgroundColor: color.color }}
                  />
                  <span>{color.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}