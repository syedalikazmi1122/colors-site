import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Heart, Star, X } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import sendRequest from '../../Utils/apirequest'; // Assuming this handles auth etc.
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// --- Predefined Color Palette for the Picker ---
// These are the colors the user can CHOOSE FROM.
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
  // Add more colors the user can pick from
];
// --- --- ---

// Helper to escape characters for regex
const escapeRegExp = (string) => {
    // Ensure input is a string before trying to replace
    if (typeof string !== 'string') {
        console.warn("escapeRegExp received non-string input:", string);
        return ''; // Return empty string or handle as appropriate
    }
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};


export function ProductInfo() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [svgContent, setSvgContent] = useState(null); // Original SVG text content
  const [modifiedSvgContent, setModifiedSvgContent] = useState(null); // SVG text with user changes applied
  const [loadingSvg, setLoadingSvg] = useState(false);

  // State for color customization
  // Maps the original editable color to the user's chosen new color value
  const [selectedUserColors, setSelectedUserColors] = useState({}); // e.g., { "#9ea5b0": "#FFFFFF", "#3d4b61": "#8BA89B" }
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [activeEditableColor, setActiveEditableColor] = useState(null); // The original color currently being changed via the picker

  // --- Fetch Product Data ---
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      setSelectedImageIndex(0);
      setSvgContent(null);
      setModifiedSvgContent(null);
      setSelectedUserColors({});

      try {
        // Use the slug to fetch the specific product
        const response = await sendRequest('GET', `/svgs/${slug}`);

        if (response.status === 200 && response.data) {
          // **Data Validation/Normalization**
          const fetchedProduct = {
            ...response.data,
            // Ensure editablecolors is an array, default to empty if missing/null/not array
            editablecolors: Array.isArray(response.data.editablecolors) ? response.data.editablecolors : [],
            // Ensure url is an array
            url: Array.isArray(response.data.url) ? response.data.url : (response.data.url ? [response.data.url] : [])
          };
          setProduct(fetchedProduct);

          // Automatically fetch SVG content IF the first image is an SVG AND editable colors are defined
          if (
            fetchedProduct.url.length > 0 &&
            fetchedProduct.url[0]?.toLowerCase().endsWith('.svg') &&
            fetchedProduct.editablecolors.length > 0 // Check if customization is intended
          ) {
            fetchSvg(fetchedProduct.url[0]);
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
  // useCallback to memoize the function if needed elsewhere, though simple here
  const fetchSvg = useCallback(async (url) => {
    setLoadingSvg(true);
    setSvgContent(null);
    setModifiedSvgContent(null);
    setSelectedUserColors({}); // Reset customizations when fetching new SVG
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
      }
      const svgText = await response.text();
      setSvgContent(svgText);
      // No initial modification needed, will be generated on user interaction
    } catch (error) {
      console.error('Error fetching SVG:', error);
      toast.error(`Could not load SVG content: ${error.message}`);
      setSvgContent(null); // Clear on error
    } finally {
      setLoadingSvg(false);
    }
  }, []); // No dependencies needed for this version of fetchSvg


  // --- Determine if the CURRENTLY selected image allows customization ---
  const isCurrentSelectionCustomizable = () => {
    if (!product || !product.url || product.url.length === 0) {
      return false; // No product or URLs
    }
    const currentUrl = product.url[selectedImageIndex];
    return (
      currentUrl && // Check if URL exists at index
      currentUrl.toLowerCase().endsWith('.svg') && // Is it an SVG?
      product.editablecolors && // Does the editablecolors array exist?
      product.editablecolors.length > 0 && // Does it have colors defined?
      svgContent !== null // Has the SVG content actually loaded?
    );
  };

  // --- Handle Thumbnail Clicks ---
  const handleThumbnailClick = (index) => {
    if (index === selectedImageIndex) return; // Don't reload if clicking the same image

    setSelectedImageIndex(index);
    // Reset SVG related states immediately
    setSvgContent(null);
    setModifiedSvgContent(null);
    setSelectedUserColors({});

    // Check if the NEWLY selected image is an SVG AND has editable colors defined
    const newUrl = product?.url?.[index];
    if (
        newUrl &&
        newUrl.toLowerCase().endsWith('.svg') &&
        product?.editablecolors?.length > 0
    ) {
      // If yes, fetch its content
      fetchSvg(newUrl);
    }
    // If it's not a customizable SVG, states remain null/empty, and the non-SVG image will be shown.
  };


  // --- Apply User Color Changes to SVG Content ---
  const updateSvgDisplay = useCallback(() => {
    // Only proceed if we have the original SVG and user has made selections
    if (!svgContent || Object.keys(selectedUserColors).length === 0) {
      setModifiedSvgContent(null); // Show original if no changes or no base SVG
      return;
    }

    let currentSvg = svgContent; // Start with the original content

    // Iterate through the user's color mappings { originalColor: newUserColor }
    for (const [originalColor, newUserColorValue] of Object.entries(selectedUserColors)) {
       // Escape the original color for use in regex (handles #, etc.)
       const escapedOriginalColor = escapeRegExp(originalColor);
       if (!escapedOriginalColor) continue; // Skip if original color is invalid

        // Build regex to find the original color in common attributes (case-insensitive)
        // Looks for fill="#...", stroke='#...', stop-color="..." etc.
       const attributeRegex = new RegExp(
         `(fill|stroke|stop-color)\\s*=\\s*(["'])\\s*${escapedOriginalColor}\\s*\\2`,
         'gi' // g: global, i: case-insensitive
       );

        // Replace within attributes, preserving attribute name and quotes
        currentSvg = currentSvg.replace(attributeRegex, (match, attribute, quote) => {
           return `${attribute}=${quote}${newUserColorValue}${quote}`;
        });

        // Also try to replace within style="..." attributes
        // Looks for style="...; fill: #... ; ..."
        const styleRegex = new RegExp(
          `(fill|stroke|stop-color):\\s*${escapedOriginalColor}\\s*(;?)`, // Optional semicolon
          'gi'
        );
         currentSvg = currentSvg.replace(styleRegex, (match, property, semicolon) => {
             return `${property}: ${newUserColorValue}${semicolon || ''}`; // Keep semicolon if present
        });
    }

    // Update the state with the fully modified SVG string
    setModifiedSvgContent(currentSvg);

  }, [svgContent, selectedUserColors]); // Dependencies: run when original SVG or user selections change


  // --- Effect to trigger SVG update when user selections change ---
  useEffect(() => {
    // Only update display if the current selection *is* customizable
    if (isCurrentSelectionCustomizable()) {
      updateSvgDisplay();
    } else {
      // If current view is not customizable (e.g., user switched to PNG),
      // ensure modified content is cleared.
      setModifiedSvgContent(null);
    }
    // Note: isCurrentSelectionCustomizable() result depends on product, selectedImageIndex, svgContent, etc.
    // Adding it directly might cause loops. We rely on its core dependencies changing.
  }, [selectedUserColors, svgContent, product, selectedImageIndex, updateSvgDisplay]); // Re-run when relevant state changes


  // --- Handle Selecting a New Color from the Picker ---
  const handleColorSelect = (newUserColorOption) => {
    if (!activeEditableColor) return; // Should not happen if modal opened correctly

    // Update the mapping: original editable color -> new chosen color value
    setSelectedUserColors((prev) => ({
      ...prev,
      [activeEditableColor]: newUserColorOption.color, // Store the hex/rgb value
    }));

    // Close the picker
    setIsColorPickerOpen(false);
    setActiveEditableColor(null);
  };

  // --- Open Color Picker ---
  const openColorPicker = (originalColor) => {
    setActiveEditableColor(originalColor); // Set which original color we are modifying
    setIsColorPickerOpen(true);
  };

  // --- Add to Cart/Wishlist --- (Keep your existing simple functions)
  // Note: Customization data (selectedUserColors) is NOT sent to backend here.
   const addToCart = async () => {
    if (!product) return;
    try {
        // TODO: If customization is needed in cart, send selectedUserColors or modifiedSvgContent
        const response = await sendRequest('POST', '/cart', { productId: product._id, quantity: 1 });
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
  if (loading) {
    return ( /* Loading Spinner */ "" );
  }

  if (error || !product) {
    return ( /* Error Message */"" );
  }

  // Determine if customization UI should be shown for the *current* view
  const showCustomization = isCurrentSelectionCustomizable();
  const currentImageUrl = product.url[selectedImageIndex];


  return (
    <>
      <Navbar />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images Section */}
          <div className="flex flex-col md:flex-row-reverse lg:flex-row gap-4">
            {/* Main Image Display */}
            <div className="flex flex-row md:flex-col md:w-24 gap-2 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto py-2 md:py-0 md:max-h-[500px] lg:max-h-[600px]">
              {product.url.map((imageUrl, index) => {
                 // Determine if this specific thumbnail corresponds to a customizable SVG
                 const isThumbCustomizable = imageUrl?.toLowerCase().endsWith('.svg') && product.editablecolors?.length > 0;
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
                        <img
                          src={imageUrl || '/placeholder.svg'}
                          alt={`${product.title} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => { e.target.style.display='none'; /* Or show placeholder */ }}
                        />
                        {/* Indicator for customizable SVGs */}
                        {isThumbCustomizable && (
                            <span className="absolute bottom-0 right-0 bg-rose-600 text-white text-[8px] px-1 rounded-tl-md font-semibold">EDIT</span>
                        )}
                      </button>
                 );
              })}
            </div>
            <div className="flex-1 flex justify-center items-center border rounded-lg p-2 bg-gray-50 aspect-square overflow-hidden min-h-[300px]">
             {loadingSvg ? (
                 <div className="text-gray-500 animate-pulse">Loading SVG...</div>
             ) : modifiedSvgContent && showCustomization ? ( // Show modified SVG if available AND current view is customizable
                <div
                  className="w-full h-full max-w-full max-h-full object-contain"
                  dangerouslySetInnerHTML={{ __html: modifiedSvgContent }}
                  aria-live="polite" // Announce changes if possible
                />
              ) : currentImageUrl?.toLowerCase().endsWith('.svg') ? ( // Show original SVG if it's an SVG
                <object
                  data={currentImageUrl}
                  type="image/svg+xml"
                  className="w-full h-full max-w-full max-h-full object-contain"
                  aria-label={`${product.title} main image`}
                  // Add key to force re-render if URL changes but component doesn't unmount
                  key={currentImageUrl}
                >
                  {/* Fallback for <object> */}
                  <img
                    src={currentImageUrl} // Try img fallback if object fails
                    alt={`${product.title} (SVG fallback)`}
                    className="w-full h-full max-w-full max-h-full object-contain"
                  />
                </object>
              ) : currentImageUrl ? ( // Show standard image if not SVG
                <img
                  src={currentImageUrl}
                  alt={`${product.title} main image`}
                  className="w-full h-full max-w-full max-h-full object-contain rounded"
                />
              ) : (
                 <div className="text-gray-400">No image selected</div>
              )}
            </div>

            {/* Thumbnails Column */}
       
          </div>

          {/* Product Details */}
          <div className="mt-6 lg:mt-0">
            {/* Title, Price, Category etc. */}
            <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-2">{product.title}</h1>
             <div className="flex items-baseline gap-4 mb-4 md:mb-6">
                <p className="text-lg md:text-xl font-semibold text-black">${product.price?.toFixed(2)}</p>
                <p className="text-sm md:text-base text-gray-600">{product.category}</p>
            </div>
      
            <div className="space-y-6 md:space-y-8">
              {/* --- Color Customization Section --- */}
              {/* Render this section ONLY if the current selection is customizable */}
              {showCustomization && (
                <div className="border-t pt-6">
                  <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">Customize Colors:</h2>
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {/* Iterate through the colors defined in the product's editablecolors array */}
                    {product.editablecolors.map((originalColor) => (
                      <div key={originalColor} className="flex flex-col items-center text-center">
                        <button
                          onClick={() => openColorPicker(originalColor)}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-300 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 transition-all shadow-sm"
                          style={{
                            // Display the user's selected color if chosen, otherwise the original
                            backgroundColor: selectedUserColors[originalColor] || originalColor,
                          }}
                          aria-label={`Change color: ${originalColor}`}
                        />
                         {/* Optional: Display the original color code for reference */}
                         <span className="text-[10px] mt-1 text-gray-500 font-mono break-all" title={originalColor}>
                              {originalColor}
                         </span>
                      </div>
                    ))}
                  </div>
                   <p className="text-xs text-gray-500 mt-3">Click a circle above to change that color element using the palette.</p>
                </div>
              )}

              {/* Actions: Add to Cart / Wishlist */}
              <div className="flex w-3/4  mx-auto gap-3 border-t pt-6">
                 {/* Add to Cart Button */}
                 <button
                    onClick={addToCart}
                    className="flex-1 px-4 md:px-6 py-3 bg-gray-800  text-white font-medium rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors text-sm md:text-base text-center disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading || loadingSvg} // Disable if product or SVG is loading
                 >
                    ADD TO CART - ${product.price?.toFixed(2)}
                 </button>
                 {/* Wishlist Button */}
                 <button
                    onClick={addToWishlist}
                    title="Add to Wishlist"
                    aria-label="Add to Wishlist"
                    className="flex items-center justify-center px-3 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-colors duration-200 disabled:opacity-60"
                    disabled={loading}
                 >
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                 </button>
              </div>
              <p className="text-gray-700 mb-6 md:mb-8 text-sm md:text-base leading-relaxed">{product.description || 'No description available.'}</p>

            </div>
          </div>
        </div>
      </div>

      {/* --- Color Picker Modal --- */}
      {isColorPickerOpen && activeEditableColor && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"> {/* Ensure high z-index */}
          <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">
            {/* Modal Header */}
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
             {/* Modal Body - Scrollable Color Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 overflow-y-auto pr-2 flex-1"> {/* Make grid scrollable */}
               {/* Predefined Palette Options */}
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
               {/* Option to Revert to Original */}
                <button
                   key={`${activeEditableColor}-original`} // Unique key
                  onClick={() => handleColorSelect({ label: 'Original', color: activeEditableColor })}
                  className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-100 rounded group focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-rose-50 transition-colors"
                   aria-label={`Revert to original color ${activeEditableColor}`}
                >
                   <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 shadow-sm group-hover:scale-105 transition-transform relative bg-gradient-to-br from-gray-200 to-gray-50" // Visual cue for original
                    style={{ backgroundColor: activeEditableColor }}
                  >
                     <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-black opacity-50 mix-blend-overlay">Revert</span>
                   </div>
                   <span className="text-xs md:text-sm text-gray-700 group-hover:text-rose-700">Original Color</span>
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