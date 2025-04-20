import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Heart, Star, X } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import sendRequest from '../../Utils/apirequest'; // Assuming this handles auth etc.
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// --- Predefined Color Palette ---
const colorPaletteOptions = [
    { name: 'white', label: 'White', color: '#FFFFFF' },
    { name: 'black', label: 'Black', color: '#000000' },
    { name: 'cream', label: 'Cream', color: '#F5E6D3' },
    { name: 'sage', label: 'Sage', color: '#8BA89B' },
    { name: 'sage-light', label: 'Light Sage', color: '#D1D9D1' },
    { name: 'olive', label: 'Olive', color: '#8B9A7A' },
    { name: 'blue', label: 'Ocean Blue', color: '#4A7081' },
    { name: 'dusty-blue', label: 'Dusty Blue', color: '#92A5B2' },
    { name: 'light-blue', label: 'Sky Blue', color: '#B8D0D8' },
    { name: 'rose', label: 'Rose', color: '#D8B8C4'},
    { name: 'terracotta', label: 'Terracotta', color: '#B47A5B'},
    { name: 'gold', label: 'Gold', color: '#C1A36F'},
];
// --- --- ---

const escapeRegExp = (string) => {
    if (typeof string !== 'string') {
        console.warn("escapeRegExp received non-string input:", string);
        return '';
    }
    // Escape characters relevant to CSS/SVG color values and regex special chars
    return string.replace(/[.*+?^${}()|[\]\\#]/g, '\\$&');
};


export function ProductInfo() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [svgContent, setSvgContent] = useState(null);
  const [modifiedSvgContent, setModifiedSvgContent] = useState(null);
  const [loadingSvg, setLoadingSvg] = useState(false);

  const [selectedUserColors, setSelectedUserColors] = useState({});
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [activeEditableColor, setActiveEditableColor] = useState(null);

  // --- Fetch Product Data ---
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      // Reset all relevant states
      setProduct(null);
      setSelectedImageIndex(0);
      setSvgContent(null);
      setModifiedSvgContent(null);
      setSelectedUserColors({});
      setLoadingSvg(false); // Ensure SVG loading state is reset

      try {
        const response = await sendRequest('GET', `/svgs/${slug}`);

        if (response.status === 200 && response.data) {
          let fetchedProductData = {
            ...response.data,
            editablecolors: Array.isArray(response.data.editablecolors) ? response.data.editablecolors : [],
            url: Array.isArray(response.data.url) ? response.data.url : (response.data.url ? [response.data.url] : [])
          };

          // --- Reorder URLs to prioritize SVG at index 0 ---
          if (fetchedProductData.url.length > 1) {
            const urls = [...fetchedProductData.url]; // Create mutable copy
            const firstSvgIndex = urls.findIndex(url => typeof url === 'string' && url.toLowerCase().endsWith('.svg'));

            // If an SVG exists and it's not already the first item
            if (firstSvgIndex > 0) {
              const svgUrl = urls.splice(firstSvgIndex, 1)[0]; // Remove SVG from its position
              urls.unshift(svgUrl); // Add SVG to the beginning
              fetchedProductData.url = urls; // Update the data object
            }
          }
          // --- End Reordering ---

          setProduct(fetchedProductData);

          // Fetch SVG content if the (potentially reordered) first image is a customizable SVG
          if (
            fetchedProductData.url.length > 0 &&
            fetchedProductData.url[0]?.toLowerCase().endsWith('.svg') &&
            fetchedProductData.editablecolors.length > 0
          ) {
            // Fetch SVG for the *first* image (which is now guaranteed to be the SVG if one exists)
            fetchSvg(fetchedProductData.url[0]);
          }
        } else {
          throw new Error(response.data?.message || `Product not found or failed to load (Status: ${response.status})`);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product details.');
        toast.error(err.message || 'Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]); // Dependency: slug changes -> refetch

  // --- Fetch SVG Content ---
  const fetchSvg = useCallback(async (url) => {
    console.log("Attempting to fetch SVG from URL:", url); // Keep for debugging if needed
    if (!url) {
        console.warn("fetchSvg called with no URL");
        return;
    }
    setLoadingSvg(true);
    setSvgContent(null);
    setModifiedSvgContent(null);
    setSelectedUserColors({});
    try {
      const response = await fetch(url);
      const svgText = await response.text();

      // Optional: Log raw text only if debugging is necessary
      // console.log("Raw fetched text received (first 200 chars):", svgText.substring(0, 200));

      if (!response.ok) {
          // Provide more context in the error message if possible
          throw new Error(`Failed to fetch SVG (${response.status} ${response.statusText} from ${url}). Response preview: ${svgText.substring(0,100)}`);
      }

      // --- THIS IS THE CORRECTED VALIDATION ---
      // Check if the string contains '<svg' tag (case-insensitive) after trimming
      if (!/<svg/i.test(svgText.trim())) {
          console.error("SVG validation failed. Text did not contain '<svg'. Received:", svgText.substring(0, 200)); // Log what was received
          throw new Error('Fetched content does not appear to be a valid SVG.');
      }
      // --- END CORRECTION ---

      setSvgContent(svgText); // Set content if validation passes

    } catch (error) {
      console.error('Error fetching or processing SVG:', error);
      // Ensure the error message shown to the user is helpful but not overly technical
      toast.error(`Could not load SVG preview: ${error.message.split('.')[0]}`); // Show simpler error
      setSvgContent(null); // Clear on error
    } finally {
      setLoadingSvg(false);
    }
  }, []); // Dependencies remain empty if fetchSvg doesn't rely on component state/props directly
  // --- Determine if the CURRENTLY selected image allows customization ---
  const isCurrentSelectionCustomizable = useCallback(() => {
    if (!product || !product.url || product.url.length === 0) {
      return false;
    }
    const currentUrl = product.url[selectedImageIndex];
    return (
      currentUrl &&
      currentUrl.toLowerCase().endsWith('.svg') &&
      product.editablecolors &&
      product.editablecolors.length > 0 &&
      svgContent !== null // Crucially, the SVG content must be loaded
    );
  }, [product, selectedImageIndex, svgContent]); // Depends on these states

  // --- Handle Thumbnail Clicks ---
  const handleThumbnailClick = useCallback((index) => {
    if (index === selectedImageIndex || !product || !product.url || index >= product.url.length) return;

    setSelectedImageIndex(index);

    // Immediately reset SVG state for the new selection
    setSvgContent(null);
    setModifiedSvgContent(null);
    setSelectedUserColors({}); // Reset colors when switching images

    // Check if the NEWLY selected image is a customizable SVG
    const newUrl = product.url[index];
    const isNewSelectionSvg = newUrl && newUrl.toLowerCase().endsWith('.svg');
    const hasEditableColors = product.editablecolors && product.editablecolors.length > 0;

    if (isNewSelectionSvg && hasEditableColors) {
      fetchSvg(newUrl); // Fetch its content if it's a customizable SVG
    } else {
      // If it's not a customizable SVG (or not an SVG at all), ensure loading state is false
      setLoadingSvg(false);
    }
  }, [selectedImageIndex, product, fetchSvg]); // Added fetchSvg dependency


  // --- Apply User Color Changes to SVG Content ---
  const updateSvgDisplay = useCallback(() => {
    // Require original SVG content to exist
    if (!svgContent) {
       setModifiedSvgContent(null); // Cannot modify if base SVG isn't loaded
       return;
    }
    // If no colors selected, show original (or ensure modified is null)
    if (Object.keys(selectedUserColors).length === 0) {
       setModifiedSvgContent(null); // Explicitly show original by clearing modified
       return;
    }

    let currentSvg = svgContent;

    for (const [originalColor, newUserColorValue] of Object.entries(selectedUserColors)) {
        // Ensure newUserColorValue is valid before proceeding
        if (!newUserColorValue || typeof newUserColorValue !== 'string') continue;

        const escapedOriginalColor = escapeRegExp(originalColor);
        if (!escapedOriginalColor) continue;

        // Regex for attributes like fill="#...", stroke='#...', stop-color="..."
        // Added '#' optionality in case colors are specified without it sometimes (though less common)
        const attributeRegex = new RegExp(
            `(fill|stroke|stop-color)\\s*=\\s*(["'])\\s*#?${escapedOriginalColor}\\s*\\2`,
            'gi'
        );
        currentSvg = currentSvg.replace(attributeRegex, (match, attribute, quote) => {
            // Ensure the replacement includes the hash if the new color needs it
            const formattedNewColor = newUserColorValue.startsWith('#') ? newUserColorValue : `#${newUserColorValue}`;
            return `${attribute}=${quote}${formattedNewColor}${quote}`;
        });

        // Regex for style="..." attributes like style="...; fill: #... ; ..."
        // Added '#' optionality here too
        const styleRegex = new RegExp(
            `(fill|stroke|stop-color):\\s*#?${escapedOriginalColor}\\s*(;?)`,
            'gi'
        );
        currentSvg = currentSvg.replace(styleRegex, (match, property, semicolon) => {
            const formattedNewColor = newUserColorValue.startsWith('#') ? newUserColorValue : `#${newUserColorValue}`;
            return `${property}: ${formattedNewColor}${semicolon || ''}`; // Preserve semicolon if present
        });
    }

    // console.log("Original SVG:", svgContent); // DEBUG
    // console.log("Modified SVG:", currentSvg); // DEBUG
    setModifiedSvgContent(currentSvg);

  }, [svgContent, selectedUserColors]);


  // --- Effect to trigger SVG update when selections or content change ---
  useEffect(() => {
    // Update display only if the current image is meant to be customizable *and* the base SVG is loaded
    if (isCurrentSelectionCustomizable()) {
        updateSvgDisplay();
    } else {
        // If not customizable (e.g., switched to PNG, or SVG not loaded yet), ensure modified content is cleared.
        setModifiedSvgContent(null);
    }
  }, [selectedUserColors, svgContent, isCurrentSelectionCustomizable, updateSvgDisplay]); // Dependencies


  // --- Handle Selecting a New Color ---
  const handleColorSelect = (newUserColorOption) => {
    if (!activeEditableColor || !newUserColorOption) return;

    setSelectedUserColors((prev) => ({
      ...prev,
      [activeEditableColor]: newUserColorOption.color,
    }));

    setIsColorPickerOpen(false);
    setActiveEditableColor(null);
  };

  // --- Open Color Picker ---
  const openColorPicker = (originalColor) => {
    setActiveEditableColor(originalColor);
    setIsColorPickerOpen(true);
  };

  // --- Add to Cart / Wishlist --- (Simple versions)
   const addToCart = async () => {
    if (!product) return;
    try {
        // FUTURE: Send customization data if needed
        // const customizationData = modifiedSvgContent ? { svgData: modifiedSvgContent } : { selectedColors: selectedUserColors };
        const response = await sendRequest('POST', '/cart', { productId: product._id, quantity: 1 /*, customization: customizationData */ });
        if (response.status === 200 || response.status === 201) {
            toast.success('Added to cart!');
        } else {
            throw new Error(response.data?.message || 'Error adding to cart');
        }
    } catch (err) {
        toast.error(`Add to Cart failed: ${err.message}`);
        console.error('Add to Cart error:', err);
    }
   };

   const addToWishlist = async () => {
     if (!product) return;
     try {
        const response = await sendRequest('POST', '/wishlist', { productId: product._id });
        if (response.status === 200 || response.status === 201) {
            toast.success('Added to wishlist!');
        } else {
            throw new Error(response.data?.message || 'Error adding to wishlist');
        }
     } catch (err) {
        toast.error(`Add to Wishlist failed: ${err.message}`);
        console.error('Add to Wishlist error:', err);
     }
   };

  // --- Render Logic ---
  if (loading && !product) { // Show loading only initially
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading Product...</p> {/* Replace with spinner */}
      </div>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh] px-4">
          <p className="text-center text-red-600">{error || 'Product not found.'}</p>
        </div>
        <Footer />
        <Toaster position="bottom-right" />
      </>
    );
  }

  // Determine if the current image is an SVG, regardless of customization possibility
  const currentImageUrl = product.url?.[selectedImageIndex];
  const isCurrentSvg = typeof currentImageUrl === 'string' && currentImageUrl.toLowerCase().endsWith('.svg');
  // Determine if the customization UI should be shown (requires loaded SVG and editable colors)
  const showCustomizationControls = isCurrentSelectionCustomizable();


  return (
    <>
      <Navbar />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images Section */}
          <div className="flex flex-col md:flex-row-reverse lg:flex-row gap-4">
            {/* Thumbnails Column */}
             <div className="flex flex-row md:flex-col md:w-24 gap-2 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto py-2 md:py-0 md:max-h-[500px] lg:max-h-[600px] order-first md:order-last lg:order-first">
              {product.url.map((imageUrl, index) => {
                 const isThumbSvg = typeof imageUrl === 'string' && imageUrl.toLowerCase().endsWith('.svg');
                 const isThumbCustomizable = isThumbSvg && product.editablecolors?.length > 0;
                 return (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border-2 ${
                          selectedImageIndex === index ? 'border-rose-600 ring-2 ring-rose-300' : 'border-gray-200'
                        } rounded-md overflow-hidden transition-all hover:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1`}
                        aria-label={`View image ${index + 1}${isThumbCustomizable ? ' (customizable)' : ''}`}
                        aria-current={selectedImageIndex === index ? 'true' : 'false'}
                      >
                        {/* Use a placeholder or specific thumbnail logic if available */}
                        <img
                          src={imageUrl || '/placeholder.svg'} // Ensure imageUrl is valid
                          alt={`${product.title} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Handle broken image links for thumbnails
                            e.currentTarget.src = '/placeholder-broken.svg'; // Or some indication of error
                            e.currentTarget.style.objectFit = 'contain';
                          }}
                        />
                        {isThumbCustomizable && (
                            <span className="absolute bottom-0 right-0 bg-rose-600 text-white text-[8px] px-1 rounded-tl-md font-semibold">EDIT</span>
                        )}
                      </button>
                 );
              })}
            </div>

          
            <div className="flex-1 relative border rounded-lg bg-gray-50 overflow-hidden order-last md:order-first lg:order-last">
  {/* SVG Display Container with consistent height */}
  <div className="w-full aspect-square flex items-center justify-center">
    {/* Loading state for SVG content */}
    {loadingSvg ? (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        <p className="mt-4 text-gray-500">Loading preview...</p>
      </div>
    ) : modifiedSvgContent && showCustomizationControls ? (
      // Render MODIFIED SVG with better sizing constraints
      <div 
        className="w-full h-full flex items-center justify-center p-4"
        dangerouslySetInnerHTML={{ __html: modifiedSvgContent }}
        aria-label="Customized design preview"
        aria-live="polite"
        role="img"
      />
    ) : isCurrentSvg && svgContent ? (
      // Render ORIGINAL SVG with consistent styling as modified one
      <div
        className="w-full h-full flex items-center justify-center p-4"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        aria-label="Original design preview"
        role="img"
      />
    ) : isCurrentSvg && !svgContent && !loadingSvg ? (
      // Error state with better visual feedback
      <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
        <div className="rounded-full bg-red-100 p-3 mb-3">
          <X className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-red-500 font-medium mb-2">Could not load SVG preview</p>
        <button 
          onClick={() => fetchSvg(currentImageUrl)} 
          className="text-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-50 transition-colors"
        >
          Try Again
        </button>
      </div>
    ) : currentImageUrl ? (
      // Standard Image (PNG, JPG, etc.) with better handling
      <img
        src={currentImageUrl}
        alt={`${product.title} - Image ${selectedImageIndex + 1}`}
        className="max-w-full max-h-full object-contain"
        onError={(e) => {
          e.currentTarget.src = '/placeholder-broken.svg';
          e.currentTarget.alt = 'Image failed to load';
        }}
      />
    ) : (
      // Empty state with better visual indication
      <div className="flex flex-col items-center justify-center h-full w-full p-6">
        <p className="text-gray-400">No image available</p>
      </div>
    )}
  </div>
  
  {/* Optional: Add an indicator when color customization is available */}
  {isCurrentSelectionCustomizable() && (
    <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs px-2 py-1 rounded-md font-medium">
      Customizable
    </div>
  )}
</div>
                  </div>

                  {/* Product Details */}
          <div className="mt-6 lg:mt-0">
            <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-2">{product.title}</h1>
            <div className="flex items-baseline gap-4 mb-4 md:mb-6">
              <p className="text-lg md:text-xl font-semibold text-black">${product.price?.toFixed(2)}</p>
              <p className="text-sm md:text-base text-gray-600">{product.category}</p>
            </div>

            <div className="space-y-6 md:space-y-8">
              {/* Description - Moved slightly higher for better flow */}
              <p className="text-gray-700 mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
                 {product.description || 'No description available.'}
              </p>

              {/* Color Customization Section */}
              {/* Show controls only if the current selected image is an SVG, has editable colors, AND the SVG content is loaded */}
              {showCustomizationControls && (
                <div className="border-t pt-6">
                  <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">Customize Colors:</h2>
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {product.editablecolors.map((originalColor) => (
                      <div key={originalColor} className="flex flex-col items-center text-center">
                        <button
                          onClick={() => openColorPicker(originalColor)}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-300 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 transition-all shadow-sm"
                          style={{
                            backgroundColor: selectedUserColors[originalColor] || originalColor,
                          }}
                          aria-label={`Change color: ${originalColor}`}
                          title={`Click to change ${originalColor}`}
                        />
                         <span className="text-[10px] mt-1 text-gray-500 font-mono break-all max-w-[48px] md:max-w-[60px]" title={originalColor}>
                              {originalColor}
                         </span>
                      </div>
                    ))}
                  </div>
                   <p className="text-xs text-gray-500 mt-3">Click a circle above to change its color.</p>
                </div>
              )}

              {/* Actions: Add to Cart / Wishlist */}
              <div className="flex flex-col sm:flex-row w-full sm:w-3/4 mx-auto gap-3 border-t pt-6 mt-4"> {/* Adjusted width and added top margin */}
                 <button
                    onClick={addToCart}
                    className="flex-1 px-4 md:px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors text-sm md:text-base text-center disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading || loadingSvg}
                 >
                    ADD TO CART - ${product.price?.toFixed(2)}
                 </button>
                 <button
                    onClick={addToWishlist}
                    title="Add to Wishlist"
                    aria-label="Add to Wishlist"
                    className="flex items-center justify-center px-3 py-3 sm:py-0 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-colors duration-200 disabled:opacity-60"
                    disabled={loading}
                 >
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      {isColorPickerOpen && activeEditableColor && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
              <h3 className="text-base md:text-lg font-medium text-gray-800 flex items-center gap-2">
                 <span>Pick New Color for:</span>
                 <span
                     className="inline-block w-5 h-5 rounded-full border border-gray-400 shadow-sm"
                     style={{ backgroundColor: activeEditableColor }}
                     title={activeEditableColor}
                  />
              </h3>
              <button
                onClick={() => setIsColorPickerOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Close color picker"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 overflow-y-auto pr-2 flex-1">
              {colorPaletteOptions.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => handleColorSelect(colorOption)}
                  className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-100 rounded group focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-rose-50 transition-colors"
                  aria-label={`Select ${colorOption.label}`}
                >
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 shadow-sm group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: colorOption.color }}
                  />
                  <span className="text-xs md:text-sm text-gray-700 group-hover:text-rose-700">{colorOption.label}</span>
                </button>
              ))}
              {/* Revert Button */}
               <button
                   key={`${activeEditableColor}-original`}
                  onClick={() => handleColorSelect({ label: 'Original', color: activeEditableColor })}
                  className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-100 rounded group focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-rose-50 transition-colors"
                   aria-label={`Revert to original color ${activeEditableColor}`}
               >
                   <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 shadow-sm group-hover:scale-105 transition-transform relative flex items-center justify-center"
                    style={{ backgroundColor: activeEditableColor }}
                  >
                     <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold text-black opacity-60 mix-blend-overlay uppercase tracking-wider">Revert</span>
                   </div>
                   <span className="text-xs md:text-sm text-gray-700 group-hover:text-rose-700">Original</span>
                </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="bottom-right" />
      <Footer />
    </>
  );
}