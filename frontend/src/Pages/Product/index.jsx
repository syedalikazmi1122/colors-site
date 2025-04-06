import React, { useEffect, useState, useRef } from 'react';
import { Heart, Star } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import sendRequest from '../../Utils/apirequest';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const defaultColorCategories = [
  {
    name: 'Background',
    options: [
      { name: 'sage', label: 'Sage', color: '#8BA89B' },
      { name: 'white', label: 'White', color: '#FFFFFF' },
      { name: 'black', label: 'Black', color: '#000000' },
    ],
  },
  {
    name: 'Large Berries',
    options: [
      { name: 'blue', label: 'Ocean Blue', color: '#4A7081' },
      { name: 'dusty-blue', label: 'Dusty Blue', color: '#92A5B2' },
    ],
  },
  {
    name: 'Large Flowers',
    options: [
      { name: 'light-blue', label: 'Sky Blue', color: '#B8D0D8' },
      { name: 'cream', label: 'Cream', color: '#F5E6D3' },
    ],
  },
  {
    name: 'Leaves',
    options: [
      { name: 'sage-light', label: 'Light Sage', color: '#D1D9D1' },
      { name: 'olive', label: 'Olive', color: '#8B9A7A' },
    ],
  },
];

export function ProductInfo() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [svgContent, setSvgContent] = useState(null);
  const [extractedColors, setExtractedColors] = useState([]);
  const [colorCategories, setColorCategories] = useState(defaultColorCategories);
  const [modifiedSvg, setModifiedSvg] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await sendRequest('GET', `/svgs/${slug}`);
        if (response.status === 200) {
          console.log('Product:', response.data);
          setProduct(response.data);
          
          if (response.data.url.endsWith('.svg')) {
            fetchSvg(response.data.url);
          }
        } else {
          console.error('Error fetching product:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [slug]);
  
  // add to cart function
  const addToCart = async () => {
    try {
      const response = await sendRequest('POST', '/cart', {
        productId: product._id,
        quantity: 1,
      });
      if (response.status === 200) {
        toast('Product added to cart!');
        console.log('Product added to cart:', response.data);
      } else {
        toast.error('Error adding product to cart!');
        console.error('Error adding product to cart:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

//fucntion to add to wishlist
const addToWishlist = async () => {
  try {
    const response = await sendRequest('POST', '/wishlist', {
      productId: product._id,

    });
    if (response.status === 200) {
      toast('Product added to wishlist!');
      console.log('Product added to wishlist:', response.data);
    } else {
      toast.error('Error adding product to wishlist!');
      console.error('Error adding product to wishlist:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
  }
};


  const fetchSvg = async (url) => {
    try {
      const response = await fetch(url);
      const svgText = await response.text();
      setSvgContent(svgText);
      
      // Extract colors from SVG
      const colors = extractColorsFromSvg(svgText);
      setExtractedColors(colors);
      
      // Generate color categories based on extracted colors
      generateColorCategories(colors);
    } catch (error) {
      console.error('Error fetching SVG:', error);
    }
  };

  const extractColorsFromSvg = (svgText) => {
    const uniqueColors = new Set();
    
    // Match fill and stroke color attributes
    const fillRegex = /fill="(#[0-9A-Fa-f]{3,8}|rgb\([^)]+\)|[a-zA-Z]+)"/g;
    const strokeRegex = /stroke="(#[0-9A-Fa-f]{3,8}|rgb\([^)]+\)|[a-zA-Z]+)"/g;
    const styleRegex = /style="[^"]*(?:fill|stroke):\s*(#[0-9A-Fa-f]{3,8}|rgb\([^)]+\)|[a-zA-Z]+)/g;
    
    let match;
    
    // Extract fill colors
    while ((match = fillRegex.exec(svgText)) !== null) {
      if (match[1] !== 'none' && match[1] !== 'transparent') {
        uniqueColors.add(match[1]);
      }
    }
    
    // Extract stroke colors
    while ((match = strokeRegex.exec(svgText)) !== null) {
      if (match[1] !== 'none' && match[1] !== 'transparent') {
        uniqueColors.add(match[1]);
      }
    }
    
    // Extract colors from style attributes
    while ((match = styleRegex.exec(svgText)) !== null) {
      if (match[1] !== 'none' && match[1] !== 'transparent') {
        uniqueColors.add(match[1]);
      }
    }
    
    return Array.from(uniqueColors);
  };

  const generateColorCategories = (colors) => {
    if (colors.length === 0) return;
    

    // Create new categories based on extracted colors
    const newCategories = colors.map((color, index) => {
      const labelName = `Color ${index + 1}`;
      return {
        name: labelName,
        originalColor: color,
        options: defaultColorCategories.flatMap(cat => cat.options),
      };
    });
    
    setColorCategories(newCategories);
  };

  const handleColorSelect = (category, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [category]: color,
    }));
    
    // Apply color change to SVG
    if (svgContent) {
      updateSvgColors(category, color);
    }
  };

  const updateSvgColors = (category, color) => {
    if (!svgContent) return;
    
    // Find the original color for this category
    const categoryData = colorCategories.find(cat => cat.name === category);
    if (!categoryData) return;
    
    const originalColor = categoryData.originalColor;
    let updatedSvg = modifiedSvg || svgContent;
    
    // Replace the original color with the new one
    const regex = new RegExp(escapeRegExp(originalColor), 'g');
    updatedSvg = updatedSvg.replace(regex, color.color);
    
    setModifiedSvg(updatedSvg);
  };

  // Helper function to escape special characters in colors for regex
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Product Image */}
          <div className="flex justify-center lg:justify-start">
            {product.url.endsWith('.svg') && modifiedSvg ? (
              <div 
                ref={svgRef}
                className="w-full max-w-lg aspect-square rounded-sm"
                dangerouslySetInnerHTML={{ __html: modifiedSvg }}
              />
            ) : product.url.endsWith('.svg') ? (
              <object
                data={product.url}
                type="image/svg+xml"
                className="w-full max-w-lg aspect-square object-contain rounded-sm"
                aria-label={product.title}
              >
                {/* Fallback if SVG fails to load */}
                <img
                  src="/placeholder.svg"
                  alt={product.title}
                  className="w-full max-w-lg aspect-square object-contain rounded-sm"
                />
              </object>
            ) : (
              <img
                src={product.url}
                alt={product.title}
                className="w-full max-w-lg rounded-sm object-contain"
              />
            )}
          </div>

          {/* Product Details */}
          <div className="mt-6 lg:mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <h1 className="text-3xl md:text-4xl font-serif">{product.title}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill={star <= 4 ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <a href="#reviews" className="text-xs md:text-sm text-gray-600 hover:underline whitespace-nowrap">
                  read reviews
                </a>
              </div>
            </div>

            <p className="text-base md:text-lg mb-4 md:mb-8">{product.category}</p>
            <p className="text-gray-700 mb-6 md:mb-8 text-sm md:text-base">{product.description}</p>

            <div className="space-y-6 md:space-y-8">
              {/* Extracted Colors */}
              {extractedColors.length > 0 && (
                <div>
                  <h2 className="text-lg md:text-xl mb-3 md:mb-4">Pick your custom colors:</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                    {colorCategories.map((category) => (
                      <div key={category.name} className="text-center">
                        <button
                          onClick={() => {
                            setIsColorPickerOpen(true);
                            setActiveCategory(category.name);
                          }}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200"
                          style={{
                            backgroundColor: selectedColors[category.name]?.color || category.originalColor,
                          }}
                          aria-label={`Select ${category.name} color`}
                        />
                        <p className="text-xs md:text-sm mt-1 md:mt-2 truncate">{category.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Default Color Categories (when no SVG colors extracted) */}
              {extractedColors.length === 0 && (
                <div>
                  <h2 className="text-lg md:text-xl mb-3 md:mb-4">Pick your custom colors:</h2>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 md:gap-4">
                    {defaultColorCategories.map((category) => (
                      <div key={category.name} className="text-center">
                        <button
                          onClick={() => {
                            setIsColorPickerOpen(true);
                            setActiveCategory(category.name);
                          }}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200"
                          style={{
                            backgroundColor: selectedColors[category.name]?.color || '#FFFFFF',
                          }}
                          aria-label={`Select ${category.name} color`}
                        />
                        <p className="text-xs md:text-sm mt-1 md:mt-2 truncate">{category.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

<div className="flex items-center gap-3">
  <button 
    onClick={()=>addToCart()}
  className="flex-1 px-4 md:px-6 py-2 bg-rose-700 text-white hover:bg-rose-800 rounded-md transition-colors text-sm md:text-base text-center">
    ADD TO CART - ${product.price.toFixed(2)}
  </button>
  <button 
  onClick={()=>addToWishlist()}
  className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
    <Heart className="w-6 h-6 text-gray-600" />
  </button>
</div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      {isColorPickerOpen && activeCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base md:text-lg font-medium">Select {activeCategory} Color</h3>
              <button
                onClick={() => setIsColorPickerOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="Close color picker"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {extractedColors.length > 0 ? (
                // Show all available colors for extracted SVG colors
                colorCategories.find(cat => cat.name === activeCategory)?.options.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      handleColorSelect(activeCategory, color);
                      setIsColorPickerOpen(false);
                    }}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded"
                    aria-label={`Select ${color.label} color`}
                  >
                    <div
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-sm md:text-base">{color.label}</span>
                  </button>
                ))
              ) : (
                // Show default color options
                defaultColorCategories
                  .find((cat) => cat.name === activeCategory)
                  ?.options.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        handleColorSelect(activeCategory, color);
                        setIsColorPickerOpen(false);
                      }}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded"
                      aria-label={`Select ${color.label} color`}
                    >
                      <div
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.color }}
                      />
                      <span className="text-sm md:text-base">{color.label}</span>
                    </button>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
      <Toaster/>
      <Footer />
    </>
  );
}