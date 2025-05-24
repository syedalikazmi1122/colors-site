"use client"

import { useEffect, useState, useCallback } from "react"
import { Heart, X } from "lucide-react"
import Navbar from "../../Components/Navbar" // Adjust path as needed
import Footer from "../../Components/Footer" // Adjust path as needed
import sendRequest from "../../Utils/apirequest" // Adjust path as needed
import { useParams } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import namer from "color-namer"
import { useCurrency } from "../../Context/CurrencyContext"
import { useTranslation } from "react-i18next"
// --- Predefined Color Palette ---
const colorPaletteOptions = [
  { name: "white", label: "White", color: "#FFFFFF" },
  { name: "black", label: "Black", color: "#000000" },
  { name: "cream", label: "Cream", color: "#F5E6D3" },
  { name: "sage", label: "Sage", color: "#8BA89B" },
  { name: "sage-light", label: "Light Sage", color: "#D1D9D1" },
  { name: "olive", label: "Olive", color: "#8B9A7A" },
  { name: "blue", label: "Ocean Blue", color: "#4A7081" },
  { name: "dusty-blue", label: "Dusty Blue", color: "#92A5B2" },
  { name: "light-blue", label: "Sky Blue", color: "#B8D0D8" },
  { name: "rose", label: "Rose", color: "#D8B8C4" },
  { name: "terracotta", label: "Terracotta", color: "#B47A5B" },
  { name: "gold", label: "Gold", color: "#C1A36F" },
  // Add more colors as needed
]
// --- --- ---

// Helper function to escape characters for Regex, especially for color codes
const escapeRegExp = (string) => {
  if (typeof string !== "string") {
    console.warn("escapeRegExp received non-string input:", string)
    return ""
  }
  // Escape characters relevant to CSS/SVG color values and regex special chars
  return string.replace(/[.*+?^${}()|[\]\\#]/g, "\\$&")
}

// Helper function to get color name from hex code
const getColorNameFromHex = (hexCode) => {
  const result = namer(hexCode)
  return result.ntc[0].name // Get the exact name from the 'ntc' category
}
const changecolorcodetoname = ({ code }) => {
  return namer(code)
}
// Units for measurable products
const MEASUREMENT_UNITS = [
  { value: "cm", label: "Centimeters (cm)" },
  { value: "in", label: "Inches (in)" },
  { value: "m", label: "Meters (m)" },
]

export function ProductInfo() {
  
  const { t, i18n } = useTranslation();
  const { slug } = useParams()
  const { convertPrice, getCurrencySymbol } = useCurrency()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true) // Overall product loading
  const [error, setError] = useState(null) // Overall product error

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [svgContent, setSvgContent] = useState(null) // Stores original fetched SVG text
  const [modifiedSvgContent, setModifiedSvgContent] = useState(null) // Stores color-modified SVG text
  const [loadingSvg, setLoadingSvg] = useState(false) // Specific to SVG fetch/parse
  const [svgError, setSvgError] = useState(null) // Specific to SVG errors

  // State for tracking standard image loading (non-SVG)
  const [loadingStandardImage, setLoadingStandardImage] = useState(false)

  const [selectedUserColors, setSelectedUserColors] = useState({})
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [activeEditableColor, setActiveEditableColor] = useState(null)

  // Measurements state (for measurable products)
  const [measurements, setMeasurements] = useState({
    width: 0,
    height: 0,
    units: "cm",
  })

  // --- Fetch Product Data ---
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      // Reset all relevant states
      setProduct(null)
      setSelectedImageIndex(0)
      setSvgContent(null)
      setModifiedSvgContent(null)
      setSelectedUserColors({})
      setLoadingSvg(false)
      setSvgError(null)
      setLoadingStandardImage(false) // Reset standard image loading state
      // Reset measurements to defaults
      setMeasurements({
        width: 0,
        height: 0,
        units: "cm",
      })

      try {
        const response = await sendRequest("GET", `/svgs/${slug}`) // Ensure endpoint is correct

        if (response.status === 200 && response.data) {
          console.log("response data", response.data)
          const fetchedProductData = {
            ...response.data,
            // Ensure editablecolors and url are arrays even if missing or single value
            editablecolors: Array.isArray(response.data.editablecolors) ? response.data.editablecolors : [],
            url: Array.isArray(response.data.url) ? response.data.url : response.data.url ? [response.data.url] : [],
          }

          // --- Reorder URLs to prioritize SVG at index 0 ---
          if (fetchedProductData.url.length > 1) {
            const urls = [...fetchedProductData.url] // Create mutable copy
            const firstSvgIndex = urls.findIndex((url) => typeof url === "string" && url.toLowerCase().endsWith(".svg"))

            // If an SVG exists and it's not already the first item
            if (firstSvgIndex > 0) {
              const svgUrl = urls.splice(firstSvgIndex, 1)[0] // Remove SVG from its position
              urls.unshift(svgUrl) // Add SVG to the beginning
              fetchedProductData.url = urls // Update the data object
            }
          }
          // --- End Reordering ---

          setProduct(fetchedProductData) // Set product state

          // Initialize measurements if product is measurable
          if (fetchedProductData.isMeasurable) {
            setMeasurements({
              width: fetchedProductData.defaultWidth || 0,
              height: fetchedProductData.defaultHeight || 0,
              units: fetchedProductData.defaultUnits || "cm",
            })
          }

          // --- Initial Image Load ---
          const firstImageUrl = fetchedProductData.url?.[0]
          if (typeof firstImageUrl === "string" && firstImageUrl.toLowerCase().endsWith(".svg")) {
            // If it's an SVG, attempt to fetch its content
            fetchSvg(firstImageUrl)
          } else if (firstImageUrl) {
            // If the first image is standard, set loading state for it
            setLoadingStandardImage(true)
            // The <img> tag's onLoad/onError will set it back to false later
          } else {
            // No images available
            console.warn("Product loaded but has no image URLs.")
          }
        } else {
          throw new Error(response.data?.message || `Product not found or failed to load (Status: ${response.status})`)
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        const errorMsg = err.message || "Failed to load product details."
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false) // Overall product loading finished
      }
    }
    fetchProduct()
  }, [slug]) // Dependency: slug

  // --- Fetch SVG Content ---
  const fetchSvg = useCallback(async (url) => {
    if (!url || typeof url !== "string") {
      console.warn("fetchSvg called with invalid URL:", url)
      setSvgError("Invalid SVG URL provided.")
      setLoadingSvg(false)
      setSvgContent(null)
      setModifiedSvgContent(null)
      return
    }
    console.log("Attempting to fetch SVG from URL:", url)
    setLoadingSvg(true)
    setSvgContent(null)
    setModifiedSvgContent(null)
    // Don't reset selectedUserColors here, allow edits across SVG reloads if desired, reset on thumbnail click instead
    setSvgError(null) // Clear previous SVG errors

    try {
      const response = await fetch(url, { cache: "no-cache" }) // Added no-cache for potential testing/debugging
      const svgText = await response.text()

      if (!response.ok) {
        // Log more details on fetch failure
        console.error(
          `Failed to fetch SVG (${response.status} ${response.statusText}) from ${url}. Response text (start):`,
          svgText.substring(0, 200),
        )
        throw new Error(`Server returned ${response.status} ${response.statusText}`)
      }

      // --- CORRECTED SVG VALIDATION ---
      // Check if the string CONTAINS '<svg' (case-insensitive) after trimming
      const trimmedText = svgText.trim()
      if (!/<svg/i.test(trimmedText)) {
        console.error(
          "SVG validation failed. Text did not contain '<svg'. Received (start):",
          trimmedText.substring(0, 200),
        )
        throw new Error("Fetched content does not appear to be a valid SVG.")
      }
      // --- END CORRECTION ---

      console.log("SVG fetched and validated successfully.")
      setSvgContent(trimmedText) // Set original content
    } catch (error) {
      console.error("Detailed Error fetching/processing SVG:", error)
      // Construct a more informative error message
      const errorMessage = `Could not load SVG preview. ${error.message || "Unknown error"}.`
      setSvgError(errorMessage) // Set specific SVG error state
      toast.error(`Error loading SVG: ${error.message.split(".")[0]}`) // Keep toast simple
      setSvgContent(null) // Ensure content is null on error
    } finally {
      setLoadingSvg(false) // Ensure loading state is turned off
    }
  }, []) // Empty dependency array is correct

  // --- Determine if the CURRENTLY selected image allows customization ---
  const isCurrentSelectionCustomizable = useCallback(() => {
    // Requires product, loaded svgContent, and editable colors defined
    return (
      product?.editablecolors?.length > 0 &&
      svgContent !== null && // Base SVG must be loaded
      !svgError && // And no SVG loading error
      product.url?.[selectedImageIndex]?.toLowerCase().endsWith(".svg") // Current must be SVG url
    )
  }, [product, selectedImageIndex, svgContent, svgError]) // Added svgError dependency

  // --- Handle Thumbnail Clicks ---
  const handleThumbnailClick = useCallback(
    (index) => {
      if (index === selectedImageIndex || !product || !product.url || index >= product.url.length) return

      console.log(`Thumbnail ${index} clicked. URL: ${product.url[index]}`)
      setSelectedImageIndex(index)

      // Reset states specific to the main image display
      setSvgContent(null)
      setModifiedSvgContent(null)
      setLoadingSvg(false)
      setSvgError(null)
      setLoadingStandardImage(false)
      setSelectedUserColors({}) // Reset user colors when switching images

      const newUrl = product.url[index]

      // If the NEWLY selected image is an SVG, attempt to fetch it.
      if (typeof newUrl === "string" && newUrl.toLowerCase().endsWith(".svg")) {
        console.log("New selection is SVG, fetching...")
        fetchSvg(newUrl) // Fetch its content
      } else if (newUrl) {
        // If it's a standard image, set its loading flag
        console.log("New selection is standard image, setting loading flag.")
        setLoadingStandardImage(true)
        // Actual loading is handled by the <img> tag changing src
      } else {
        console.log("New selection has no valid URL.")
      }
    },
    [selectedImageIndex, product, fetchSvg],
  ) // Keep fetchSvg dependency

  // --- Apply User Color Changes to SVG Content ---
  const updateSvgDisplay = useCallback(() => {
    // Require original SVG content to exist
    if (!svgContent) {
      setModifiedSvgContent(null) // Cannot modify if base SVG isn't loaded
      return
    }
    // If no colors selected, show original (or ensure modified is null)
    if (Object.keys(selectedUserColors).length === 0) {
      setModifiedSvgContent(null) // Explicitly show original by clearing modified
      return
    }

    let currentSvg = svgContent

    for (const [originalColor, newUserColorValue] of Object.entries(selectedUserColors)) {
      // Ensure newUserColorValue is valid before proceeding
      if (!newUserColorValue || typeof newUserColorValue !== "string") continue

      const escapedOriginalColor = escapeRegExp(originalColor)
      if (!escapedOriginalColor) continue

      // Regex for attributes like fill="#...", stroke='#...', stopColor="..."
      // Added '#' optionality for robustness, case-insensitive matching
      const attributeRegex = new RegExp(
        `(fill|stroke|stop-color)\\s*=\\s*(["'])\\s*#?${escapedOriginalColor}\\s*\\2`,
        "gi", // global and case-insensitive
      )
      currentSvg = currentSvg.replace(attributeRegex, (match, attribute, quote) => {
        // Ensure the replacement includes the hash
        const formattedNewColor = newUserColorValue.startsWith("#") ? newUserColorValue : `#${newUserColorValue}`
        return `${attribute}=${quote}${formattedNewColor}${quote}`
      })

      // Regex for style="..." attributes like style="...; fill: #... ; ..."
      // Added '#' optionality, case-insensitive matching
      const styleRegex = new RegExp(
        `(fill|stroke|stop-color):\\s*#?${escapedOriginalColor}\\s*(;?)`,
        "gi", // global and case-insensitive
      )
      currentSvg = currentSvg.replace(styleRegex, (match, property, semicolon) => {
        const formattedNewColor = newUserColorValue.startsWith("#") ? newUserColorValue : `#${newUserColorValue}`
        return `${property}: ${formattedNewColor}${semicolon || ""}` // Preserve semicolon if present
      })
    }

    setModifiedSvgContent(currentSvg)
  }, [svgContent, selectedUserColors])

  // --- Effect to trigger SVG update when selections or content change ---
  useEffect(() => {
    // Update display only if the current image is meant to be customizable *and* the base SVG is loaded without error
    if (isCurrentSelectionCustomizable()) {
      updateSvgDisplay()
    } else {
      // If not customizable (e.g., switched to PNG, or SVG not loaded yet/error), ensure modified content is cleared.
      setModifiedSvgContent(null)
    }
  }, [selectedUserColors, svgContent, isCurrentSelectionCustomizable, updateSvgDisplay]) // Dependencies

  // --- Handle Selecting a New Color ---
  const handleColorSelect = (newUserColorOption) => {
    if (!activeEditableColor || !newUserColorOption) return

    setSelectedUserColors((prev) => ({
      ...prev,
      [activeEditableColor]: newUserColorOption.color, // Store the hex value
    }))

    setIsColorPickerOpen(false)
    setActiveEditableColor(null) // Clear active color after selection
  }

  // --- Open Color Picker ---
  const openColorPicker = (originalColor) => {
    setActiveEditableColor(originalColor)
    setIsColorPickerOpen(true)
  }

  // --- Handle Measurement Changes ---
  const handleMeasurementChange = (field, value) => {
    // Validate numeric inputs
    if (field === "width" || field === "height") {
      const numValue = Number.parseFloat(value)
      if (isNaN(numValue) || numValue < 0) return

      setMeasurements((prev) => ({
        ...prev,
        [field]: numValue,
      }))
    } else if (field === "units") {
      if (!MEASUREMENT_UNITS.some((unit) => unit.value === value)) return

      setMeasurements((prev) => ({
        ...prev,
        units: value,
      }))
    }
  }

  // --- Add to Cart / Wishlist --- (Simple versions)
  const addToCart = async () => {
    if (!product) return
    toast.loading("Adding to cart...") // Give user feedback
    try {
      // FUTURE: Send customization data if needed
      // Consider if you want to send the modified SVG or just the selected colors
      // const customizationData = modifiedSvgContent ? { svgData: modifiedSvgContent } : { selectedColors: selectedUserColors };
      const payload = {
        productId: product._id,
        quantity: 1,
        ...(Object.keys(selectedUserColors).length > 0 && { customization: selectedUserColors }),
        ...(product.isMeasurable && {
          dimensions: {
            width: measurements.width,
            height: measurements.height,
            units: measurements.units,
          },
        }),
      }
      const response = await sendRequest("POST", "/cart", payload) // Adjust endpoint as needed
      toast.dismiss() // Dismiss loading toast
      if (response.status === 200 || response.status === 201) {
        toast.success("Added to cart!")
        // Optionally update cart count in Navbar here
      } else {
        throw new Error(response.data?.message || "Error adding to cart")
      }
    } catch (err) {
      toast.dismiss() // Dismiss loading toast
      toast.error(`Add to Cart failed: ${err.message}`)
      console.error("Add to Cart error:", err)
    }
  }

  const addToWishlist = async () => {
    if (!product) return
    toast.loading("Adding to wishlist...")
    try {
      const response = await sendRequest("POST", "/wishlist", { productId: product._id }) // Adjust endpoint as needed
      toast.dismiss()
      if (response.status === 200 || response.status === 201) {
        toast.success("Added to wishlist!")
        // Optionally update wishlist icon state
      } else {
        throw new Error(response.data?.message || "Error adding to wishlist")
      }
    } catch (err) {
      toast.dismiss()
      toast.error(`Add to Wishlist failed: ${err.message}`)
      console.error("Add to Wishlist error:", err)
    }
  }

  // --- Render Logic ---
  // Initial Product Loading State
  if (loading && !product) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600"></div>
          <p className="ml-4 text-gray-600 text-lg">{t('common.loading')}</p>
        </div>
        <Footer />
      </>
    )
  }

  // Product Loading Error State
  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[60vh] px-4 text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">{t('common.error')}</h2>
          <p className="text-red-600 max-w-md">
            {error || t('common.productLoadError')}
          </p>
        </div>
        <Footer />
        <Toaster position="bottom-right" />
      </>
    )
  }

  // --- Determine current image properties for rendering ---
  const currentImageUrl = product.url?.[selectedImageIndex]
  const isCurrentSvg = typeof currentImageUrl === "string" && currentImageUrl.toLowerCase().endsWith(".svg")
  // Use the dedicated state for SVG errors
  const hasSvgLoadError = svgError !== null
  // Show customization controls only if allowed AND the base SVG is loaded without error
  const showCustomizationControls = isCurrentSelectionCustomizable() // Relies on the updated definition

  const currentLanguage = i18n.language;
  const title = product.title?.[currentLanguage] || product.title?.en || product.title;
  const description = product.description[currentLanguage] || product.description.en;
  const materialDescription = product.materialDescription?.[currentLanguage] || product.materialDescription?.en || '';

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {" "}
        {/* Added max-width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {" "}
          {/* Increased gap */}
          {/* Product Images Section */}
          <div className="flex flex-col md:flex-row-reverse lg:flex-row gap-4">
            {/* Thumbnails Column */}
            <div className="flex flex-row md:flex-col md:w-24 gap-2 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto py-2 md:py-0 md:max-h-[500px] lg:max-h-[600px] order-first md:order-last lg:order-first">
              {product.url && product.url.length > 0 ? (
                product.url.map((imageUrl, index) => {
                  const isThumbSvg = typeof imageUrl === "string" && imageUrl.toLowerCase().endsWith(".svg")
                  // Indicate customization potential based on product data, not current load state
                  const isThumbPotentiallyCustomizable = isThumbSvg && product.editablecolors?.length > 0
                  return (
                    <button
                      key={`${slug}-thumb-${index}`} // More specific key
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border-2 ${
                        selectedImageIndex === index
                          ? "border-rose-600 ring-2 ring-rose-300"
                          : "border-gray-200 hover:border-gray-400"
                      } rounded-md overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 shadow-sm`}
                      aria-label={`View image ${index + 1}${isThumbPotentiallyCustomizable ? " (customizable)" : ""}`}
                      aria-current={selectedImageIndex === index ? "true" : "false"}
                    >
                      <img
                        src={imageUrl || "/placeholder.svg"} // Fallback placeholder
                        alt={`${title} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Handle broken image links for thumbnails
                          e.currentTarget.src = "/placeholder-broken.svg" // Or some indication of error
                          e.currentTarget.style.objectFit = "contain"
                        }}
                      />
                      {isThumbPotentiallyCustomizable && (
                        <span className="absolute bottom-0 right-0 bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-tl-md font-semibold shadow-sm">
                         {t("edit")}  
                        </span>
                      )}
                    </button>
                  )
                })
              ) : (
                <div className="text-xs text-gray-500 w-full text-center md:text-left">No images</div>
              )}
            </div>

            {/* Main Image/SVG Display Area */}
            <div className="flex-1 relative border rounded-lg bg-gray-50 overflow-hidden order-last md:order-first lg:order-last shadow-sm">
              {" "}
              {/* Added shadow */}
              <div className="w-full aspect-square flex items-center justify-center relative">
                {" "}
                {/* Container for positioning */}
                {/* --- SVG Rendering Logic --- */}
                {isCurrentSvg &&
                  (loadingSvg /* SVG Loading spinner */ ? (
                    <div className="flex flex-col items-center justify-center h-full w-full text-center p-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mb-3"></div>
                      <p className="text-sm text-gray-500">Loading preview...</p>
                    </div>
                  ) : hasSvgLoadError /* SVG Error display */ ? (
                    <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
                      <div className="rounded-full bg-red-100 p-3 mb-3">
                        <X className="w-6 h-6 text-red-500" />
                      </div>
                      <p className="text-red-600 font-medium mb-3 max-w-xs text-sm">
                        {svgError || "Could not load SVG preview"} {/* Display specific SVG error */}
                      </p>
                      <button
                        onClick={() => fetchSvg(currentImageUrl)} // Retry fetching this specific SVG
                        className="text-sm text-blue-600 border border-blue-600 rounded-md px-4 py-1.5 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : svgContent /* SVG Content (modified or original) */ ? (
                    <div
                      key={modifiedSvgContent ? "modified" : "original"} // Force re-render when switching between original/modified
                      className="w-full h-full flex items-center justify-center p-4" // Padding for spacing
                      dangerouslySetInnerHTML={{ __html: modifiedSvgContent || svgContent }}
                      aria-label={modifiedSvgContent ? "Customized design preview" : "Original design preview"}
                      aria-live="polite"
                      role="img"
                    /> /* Fallback if SVG content is null but no error/loading */
                  ) : (
                    <div className="p-6 text-center text-gray-400">
                      <p>SVG Preview unavailable.</p>
                    </div>
                  ))}
                {/* --- Standard Image Rendering Logic --- */}
                {!isCurrentSvg && currentImageUrl && (
                  <>
                    {/* Loading Indicator for Standard Image */}
                    {loadingStandardImage && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm z-10">
                        {" "}
                        {/* Slight overlay */}
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500"></div>
                        <p className="mt-3 text-sm text-gray-600">Loading image...</p>
                      </div>
                    )}
                    {/* The Actual Image Tag */}
                    <img
                      key={currentImageUrl} // Force re-render on src change
                      src={currentImageUrl || "/placeholder.svg"}
                      alt={`${title} - Image ${selectedImageIndex + 1}`}
                      className={`max-w-full max-h-full object-contain transition-opacity duration-300 ease-in-out ${loadingStandardImage ? "opacity-0" : "opacity-100"}`} // Fade in
                      // Reset loading state when image loads or errors
                      onLoad={() => setLoadingStandardImage(false)}
                      onError={(e) => {
                        setLoadingStandardImage(false)
                        e.currentTarget.src = "/placeholder-broken.svg" // Use a specific broken image placeholder
                        e.currentTarget.alt = "Image failed to load"
                        e.currentTarget.style.objectFit = "contain"
                      }}
                      loading="lazy" // Helps with initial page load
                      decoding="async" // Hint for browser
                    />
                  </>
                )}
                {/* Fallback if not SVG and no currentImageUrl */}
                {!isCurrentSvg && !currentImageUrl && !loadingStandardImage && (
                  <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>
              {/* Customization Indicator Badge */}
              {showCustomizationControls && (
                <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs px-2 py-1 rounded-md font-medium shadow z-20">
                  Customizable
                </div>
              )}
            </div>
          </div>
          {/* Product Details Section */}
          <div className="mt-6 lg:mt-0">
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-gray-900 mb-2">{title}</h1>{" "}
            {/* Adjusted font */}
            <div className="flex items-baseline gap-4 mb-4 md:mb-6">
              <p className="text-xl md:text-2xl font-semibold text-gray-800">
                {getCurrencySymbol()}
                {convertPrice(product.price)}
              </p>
              <p className="text-sm md:text-base text-gray-500 uppercase tracking-wide">{product.category}</p>{" "}
              {/* Adjusted style */}
            </div>
            {/* Description */}
            <div className="prose prose-sm sm:prose-base text-gray-700 mb-6 md:mb-8 max-w-none">
              {" "}
              {/* Using prose for better text formatting */}
              {description || <p className="italic">{t('common.noDescription')}</p>}
            </div>
            {/* Materials Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">{t('product.materials')}:</h2>
              <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-800">{t('product.material')}:</h3>
                      <span className="ml-2 text-sm text-gray-600">
                        {product.materialPrice ? `${getCurrencySymbol()}${product.materialPrice} ${t('product.perSqFt')}` : ""}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {product.material &&
                        product.material.map((material, index) => {
                          // Get the material name in the current language
                          const materialName = material[currentLanguage] || material.en || '';
                          
                          return (
                            <button
                              key={`${material.en}-${index}`}
                              className={`border border-gray-300 rounded p-3 text-center hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 ${index === 0 ? "bg-gray-500 text-white" : ""}`}
                              onClick={() => console.log(`${materialName} selected`)}
                            >
                              <div className="text-xs uppercase font-medium">{materialName}</div>
                            </button>
                          )
                        })}
                    </div>
                  </div>
              
              <div className="mt-4">
                <p className="text-gray-700">{materialDescription || t('common.noMaterialDescription')}</p>
              </div>
            </div>
            <div className="space-y-6 md:space-y-8">
              {/* Color Customization Section */}
              {showCustomizationControls && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">{t('product.customizeColors')}:</h2>
                  <div className="flex flex-wrap gap-3 md:gap-4 items-start">
                    {" "}
                    {/* Align items start */}
                    {product.editablecolors.map((originalColor) => (
                      <div key={originalColor} className="flex flex-col items-center text-center group">
                        {" "}
                        {/* Added group for potential future use */}
                        <button
                          onClick={() => openColorPicker(originalColor)}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-300 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all shadow-sm mb-1" // Ring offset increased
                          style={{
                            // Use the selected color if available, otherwise the original
                            backgroundColor: selectedUserColors[originalColor] || originalColor,
                          }}
                          aria-label={`Change color originally ${getColorNameFromHex(originalColor)}`}
                          title={`Current: ${getColorNameFromHex(selectedUserColors[originalColor] || originalColor)}. Click to change.`}
                        />
                        {/* Displaying the color name instead of hex code */}
                        <span className="text-[10px] md:text-[11px] text-gray-600 break-all max-w-[60px] md:max-w-[80px]">
                          {getColorNameFromHex(selectedUserColors[originalColor] || originalColor)}
                          {selectedUserColors[originalColor] && selectedUserColors[originalColor] !== originalColor
                            ? "*"
                            : ""}{" "}
                          {/* Indicate changed */}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    {t('product.clickToChooseColor')}{" "}
                    {Object.keys(selectedUserColors).length > 0 ? t('product.changedColorNote') : ""}
                  </p>
                </div>
              )}
              {console.log("product", product)}
              {/* Measurements Section - Only show if product is measurable */}
              {product.ismeasureable && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">{t('product.measurements')}:</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Width Input */}
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <label htmlFor="width" className="text-sm text-gray-600">
                          {t('product.width')}
                        </label>
                        <button
                          className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                          title="Wall width information"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex">
                        <input
                          type="number"
                          id="width"
                          min="0"
                          step="1"
                          value={measurements.width}
                          onChange={(e) => handleMeasurementChange("width", e.target.value)}
                          className="block w-full rounded-l-md border border-gray-300 focus:border-rose-500 focus:ring-rose-500 sm:text-sm py-2 px-3"
                          placeholder="0.0"
                        />
                        <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          {measurements.units === "in" ? "ft" : measurements.units}
                        </div>
                      </div>
                    </div>

                    {/* Height Input */}
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <label htmlFor="height" className="text-sm text-gray-600">
                          {t('product.height')}
                        </label>
                        <button
                          className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                          title="Wall height information"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex">
                        <input
                          type="number"
                          id="height"
                          min="0"
                          step="1"
                          value={measurements.height}
                          onChange={(e) => handleMeasurementChange("height", e.target.value)}
                          className="block w-full rounded-l-md border border-gray-300 focus:border-rose-500 focus:ring-rose-500 sm:text-sm py-2 px-3"
                          placeholder="0.0"
                        />
                        <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          {measurements.units === "in" ? "ft" : measurements.units}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Material Selection */}
                

                  {/* Subtotal - Calculate based on dimensions and price */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800">
                      {t('cart.subtotal')}:{" "}
                      <span className="font-semibold">
                        {getCurrencySymbol()}
                        {(() => {
                          // Calculate area in square feet/meters
                          const area = measurements.width * measurements.height
                          // Get price per square unit (default to product price if materialPrice not available)
                          const pricePerUnit = product.materialPrice || 3.45
                          // Calculate total price
                          const totalPrice = area * pricePerUnit
                          // Return formatted price or default to product price if calculation is invalid
                          return convertPrice(isNaN(totalPrice) || totalPrice <= 0 ? product.price : totalPrice)
                        })()}
                      </span>
                    </h3>
                  </div>
                </div>
              )}

              {/* Actions: Add to Cart / Wishlist */}
              <div className="flex flex-col sm:flex-row gap-3 border-t border-gray-200 pt-6 mt-6">
                {" "}
                {/* Adjusted spacing and border */}
                <button
                  onClick={addToCart}
                  className="flex-1 px-5 md:px-7 py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors text-sm md:text-base text-center shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading || loadingSvg || loadingStandardImage} // Disable during any loading
                >
                  {t('product.addToCart')}
                </button>
                <button
                  onClick={() => {}}
                  className="flex-1 px-5 md:px-7 py-3 bg-white border border-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm md:text-base text-center shadow-sm"
                >
                  {t('product.buySample')}
                </button>
                <button
                  onClick={addToWishlist}
                  title={t('product.addToWishlist')}
                  aria-label={t('product.addToWishlist')}
                  className="flex items-center justify-center p-3 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-colors duration-200 disabled:opacity-60"
                  disabled={loading} // Disable only during initial product load
                >
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-700" /> {/* Slightly darker heart */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      {isColorPickerOpen && activeEditableColor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md max-h-[85vh] flex flex-col transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale">
            {" "}
            {/* Animation */}
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-base md:text-lg font-medium text-gray-800 flex items-center gap-2">
                <span>Pick Color for:</span>
                {/* Show the color being edited */}
                <div className="flex items-center gap-1">
                  <span
                    className="inline-block w-5 h-5 rounded-full border border-gray-400 shadow-sm"
                    style={{ backgroundColor: activeEditableColor }}
                  />
                  <span className="text-sm font-medium">{getColorNameFromHex(activeEditableColor)}</span>
                </div>
              </h3>
              <button
                onClick={() => setIsColorPickerOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Close color picker"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Color Options Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4 overflow-y-auto pr-2 flex-1 -mr-2">
              {" "}
              {/* Negative margin for scrollbar */}
              {/* Palette Colors */}
              {colorPaletteOptions.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => handleColorSelect(colorOption)}
                  className="flex flex-col items-center space-y-1.5 p-2 hover:bg-gray-100 rounded-md group focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-rose-50 transition-all"
                  aria-label={`Select ${colorOption.label}`}
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 shadow-sm group-hover:scale-105 transition-transform ${selectedUserColors[activeEditableColor] === colorOption.color ? "ring-2 ring-offset-1 ring-rose-500" : ""}`} // Highlight selected
                    style={{ backgroundColor: colorOption.color }}
                  />
                  <span className="text-xs md:text-sm text-gray-700 group-hover:font-medium">{colorOption.label}</span>
                </button>
              ))}
              {/* Revert to Original Button */}
              <button
                key={`${activeEditableColor}-original`} // Unique key
                onClick={() => handleColorSelect({ label: "Original", color: activeEditableColor })} // Pass original color back
                className="flex flex-col items-center space-y-1.5 p-2 hover:bg-gray-100 rounded-md group focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-rose-50 transition-all"
                aria-label={`Revert to original color ${getColorNameFromHex(activeEditableColor)}`}
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-300 shadow-sm group-hover:scale-105 transition-transform relative flex items-center justify-center bg-cover bg-center" // Base styling
                  style={{
                    backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)`, // Diagonal line pattern
                    backgroundSize: "10px 10px", // Size of the pattern
                    backgroundColor: activeEditableColor, // The actual original color
                  }}
                >
                  {/* Optional: Text overlay instead of pattern */}
                  {/* <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-black/60 mix-blend-overlay uppercase tracking-wider">Original</span> */}
                </div>
                <span className="text-xs md:text-sm text-gray-700 group-hover:font-medium">Original</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster position="bottom-right" reverseOrder={false} />
      <Footer />

      {/* Add Animation CSS (e.g., in your main CSS file or a style tag) */}
      <style jsx global>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </>
  )
}

// If this is the main export of the file
// export default ProductInfo; // Uncomment if needed based on your routing setup
