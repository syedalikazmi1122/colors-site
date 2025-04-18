import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Image, Download, Star } from 'lucide-react';
// Assuming supabaseClient is correctly configured for client-side use
// import { supabase } from './../../supabaseClient'; // Keep if needed elsewhere, but deleteImage will import its own
import sendRequest from '../../Utils/apirequest';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../../Components/Footer';
import deleteImage from '../../Utils/deleteImage'; // Import the updated deleteImage utility
import SvgImageCarousel from './svgImageCasousel'; // Import the carousel component from previous suggestion

export function AdminDashboard() {
  const [svgs, setSvgs] = useState([]);
  const [selectedSvg, setSelectedSvg] = useState(null); // Holds the full SVG object being edited
  const [svgUrlForEditing, setSvgUrlForEditing] = useState(''); // Holds the specific .svg URL
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [extractedColors, setExtractedColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExtractingColors, setIsExtractingColors] = useState(false); // Loading state for color extraction

  useEffect(() => {
    fetchSvgs();
  }, []);

  const fetchSvgs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await sendRequest('GET', '/svgs', null);
      if (response.error) throw response.error;
      // Ensure url is always an array, even if DB stores a single string sometimes
      const formattedSvgs = response.data.map(svg => ({
        ...svg,
        url: Array.isArray(svg.url) ? svg.url : (svg.url ? [svg.url] : [])
      }));
      setSvgs(formattedSvgs);
    } catch (err) {
      console.error("Fetch SVGs error:", err);
      setError(err.message || 'Failed to fetch designs.');
      toast.error(err.message || 'Failed to fetch designs.');
    } finally {
      setLoading(false);
    }
  };

  // ----- Color Extraction Logic (mostly unchanged, ensure it handles fetch errors) -----
  const extractColorsFromSvg = async (url) => {
    setIsExtractingColors(true); // Start loading indicator for color extraction
    setExtractedColors([]); // Clear previous colors
    setError(null); // Clear previous errors specific to extraction
    console.log("Extracting colors from:", url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const svgText = await response.text();

      const uniqueColors = new Set();

      // Match hex colors (including 3, 6, 8 digits)
      const hexRegex = /#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?([0-9A-Fa-f]{2})?\b/g;
      (svgText.match(hexRegex) || []).forEach(color => uniqueColors.add(color.toLowerCase()));

      // Match rgb/rgba colors
      const rgbRegex = /rgba?\([^)]+\)/g;
      (svgText.match(rgbRegex) || []).forEach(color => uniqueColors.add(color.toLowerCase()));

      // Match named colors within attributes (more robust)
      const namedColorRegex = /(?:fill|stroke|stop-color|color)\s*=\s*"([a-zA-Z]+)"/gi;
      let match;
      while ((match = namedColorRegex.exec(svgText)) !== null) {
        const colorName = match[1].toLowerCase();
        if (colorName !== 'none' && colorName !== 'transparent' && colorName !== 'currentcolor') {
          // Basic check if it's a valid CSS color name (could use a library for full validation)
          if (/^[a-zA-Z]+$/.test(colorName)) {
            uniqueColors.add(colorName);
          }
        }
      }

      // Match style attribute colors (simplified)
      const styleRegex = /style\s*=\s*"([^"]*)"/gi;
      while ((match = styleRegex.exec(svgText)) !== null) {
        const styleContent = match[1];
        const colorProps = /(?:fill|stroke|color):\s*([^;]+)/gi;
        let styleMatch;
        while ((styleMatch = colorProps.exec(styleContent)) !== null) {
          const colorValue = styleMatch[1].trim().toLowerCase();
          if (colorValue !== 'none' && colorValue !== 'transparent' && colorValue !== 'currentcolor' && !colorValue.startsWith('url(')) {
            uniqueColors.add(colorValue);
          }
        }
      }

      // Filter out potential non-color strings if necessary (e.g., gradients)
      const finalColors = Array.from(uniqueColors).filter(color =>
        color.startsWith('#') || color.startsWith('rgb') || /^[a-zA-Z]+$/.test(color)
        // Add more sophisticated filtering if needed
      );

      console.log('Extracted colors:', finalColors);
      setExtractedColors(finalColors);
      return finalColors; // Return colors

    } catch (error) {
      console.error('Error extracting colors:', error);
      setError(`Failed to extract colors: ${error.message}. Check SVG file access and format.`);
      toast.error(`Failed to extract colors: ${error.message}`);
      return []; // Return empty array on error
    } finally {
      setIsExtractingColors(false); // Stop loading indicator
    }
  };

  // ----- Handle Edit Click -----
  const handleEdit = async (svg) => {
    // 1. Find the actual SVG URL within the svg.url array
    const svgFileUrl = svg.url.find(url => typeof url === 'string' && url.toLowerCase().endsWith('.svg'));

    if (!svgFileUrl) {
      toast.error("Could not find the .svg file for this design to extract colors.");
      console.error("SVG file URL not found in:", svg.url);
      // Optionally open the modal without color options, or prevent opening
      // For now, let's open it but show a message
      setSelectedSvg({
        ...svg,
        editablecolors: svg.editablecolors || [] // Use existing colors if any
      });
      setSvgUrlForEditing(''); // Indicate no SVG found for editing
      setExtractedColors([]); // No colors to show
      setIsEditModalOpen(true);
      return;
    }

    console.log("Found SVG URL for editing:", svgFileUrl);
    setSvgUrlForEditing(svgFileUrl); // Store the specific SVG URL

    // 2. Set selected SVG state for the modal form fields
    setSelectedSvg({
      ...svg,
      editablecolors: svg.editablecolors || [] // Initialize with current editable colors
    });

    // 3. Extract colors (show loading indicator)
    setIsEditModalOpen(true); // Open modal immediately
    await extractColorsFromSvg(svgFileUrl); // This function now sets extractedColors and loading state
  };

  // ----- Handle Update -----
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedSvg) return;

    // Ensure price is a number
    const updatedSvgData = {
      ...selectedSvg,
      price: parseFloat(selectedSvg.price) || 0, // Ensure price is number
    };
    // Remove temporary state fields if they exist before sending
    delete updatedSvgData.svgFileUrl;

    try {
      const response = await sendRequest('PUT', `/svgs/${selectedSvg._id}`, updatedSvgData);

      if (response.status === 200 || response.status === 201) { // Check for success status codes
        toast.success('Design updated successfully!');
        setIsEditModalOpen(false);
        fetchSvgs(); // Re-fetch to show updated data
        // Reset state after closing modal
        setSelectedSvg(null);
        setSvgUrlForEditing('');
        setExtractedColors([]);
      } else {
        // Handle API errors reported in the response body if available
        const errorMsg = response.error?.message || response.data?.message || 'Failed to update design!';
        toast.error(errorMsg);
        setError(errorMsg); // Set error state for potential display
      }

    } catch (err) {
      console.error("Update error:", err);
      const errorMsg = err.message || 'An unexpected error occurred during update.';
      toast.error(errorMsg);
      setError(errorMsg); // Set error state
    }
  };

  // ----- Handle Delete -----
  const handleDelete = async (id, urlsToDelete) => {
    if (!window.confirm('Are you sure you want to delete this design and its associated files?')) return;

    try {
      // 1. Delete the image files from storage
      console.log("Attempting to delete files:", urlsToDelete);
      const deleteFileResponse = await deleteImage(urlsToDelete); // Use the updated utility

      if (deleteFileResponse.error) {
        // Log the error but proceed to delete DB record anyway? Or stop?
        // Let's show a warning but try deleting the DB record.
        console.error("Error deleting files from storage:", deleteFileResponse.error);
        toast.error(`Storage cleanup issue: ${deleteFileResponse.error.message}. Attempting DB delete...`);
        // Decide if you want to stop here:
        // return;
      } else {
        console.log("Storage deletion response:", deleteFileResponse.data);
        toast.success("Associated files deleted from storage.");
      }

      // 2. Delete the database record
      const response = await sendRequest('DELETE', `/svgs/${id}`, {});

      if (response.status === 200 || response.status === 204) { // Check for success status codes
        toast.success('Design deleted successfully!');
        fetchSvgs(); // Re-fetch to update the list
      } else {
        const errorMsg = response.error?.message || response.data?.message || 'Failed to delete design!';
        toast.error(errorMsg);
        setError(errorMsg);
      }

    } catch (err) {
      console.error("Delete error:", err);
      const errorMsg = err.message || 'An unexpected error occurred during deletion.';
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  // Close Modal Function
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSvg(null);
    setSvgUrlForEditing('');
    setExtractedColors([]);
    setError(null); // Clear errors when closing modal
  };


  if (loading && !svgs.length) return <div className="flex justify-center items-center h-screen">Loading Designs...</div>;
  // Show general fetch error outside the modal
  if (error && !isEditModalOpen && !svgs.length) return <div className="text-red-500 text-center p-4">{error}</div>;


  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">SVG Designs</h1>
          <a
            href="/admin/upload"
            className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-sm hover:bg-gray-800"
          >
            <Plus className="w-5 h-5" />
            <span>Upload New</span>
          </a>
        </div>

        {/* Display general fetch error if list is loaded but an error occurred */}
        {error && !isEditModalOpen && svgs.length > 0 && (
          <div className="text-red-500 text-center p-4 mb-4 border border-red-300 bg-red-50 rounded">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {svgs.map((svg) => (
            <div key={svg._id} className="border rounded-sm p-4 space-y-4 flex flex-col">
              {/* Use SvgImageCarousel for display */}
              <div className="aspect-square bg-gray-100 rounded-sm overflow-hidden relative mb-4">
                <SvgImageCarousel
                  urls={svg.url}
                  alt={svg.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2 flex-grow">
                <h3 className="text-lg font-medium">{svg.title}</h3>
                <p className="text-sm text-gray-500">{svg.category}</p>
                <p className="text-sm text-gray-500">Price: ${svg.price?.toFixed(2)}</p> {/* Ensure price is displayed */}

                <div className="flex flex-wrap gap-2">
                  {/* Badges... */}
                  {svg.iseditable && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Editable
                    </span>
                  )}
                  {/* Removed isdownloadable as it seems implied */}
                  {svg.isfeatured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  {svg.featureOnInstagram && (
                    <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                      Instagram Feed
                    </span>
                  )}
                  {svg.isbanner && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Banner
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 mt-auto">
                <button
                  onClick={() => handleEdit(svg)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label={`Edit ${svg.title}`}
                >
                  <Edit2 className="w-5 h-5 text-gray-600" aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleDelete(svg._id, svg.url)} // Pass the full url array
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label={`Delete ${svg.title}`}
                >
                  <Trash2 className="w-5 h-5 text-red-600" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && selectedSvg && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6 sticky top-0 bg-white border-b z-10"> {/* Sticky header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif">Edit Design: {selectedSvg.title}</h2>
                  <button
                    onClick={closeEditModal} // Use dedicated close function
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                    aria-label="Close modal"
                  >
                    × {/* More standard close icon */}
                  </button>
                </div>
                {/* Display any modal-specific errors */}
                {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-6">
                {/* --- Form Fields --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      value={selectedSvg.title}
                      onChange={(e) => setSelectedSvg({ ...selectedSvg, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      id="edit-category"
                      type="text"
                      value={selectedSvg.category}
                      onChange={(e) => setSelectedSvg({ ...selectedSvg, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      id="edit-price"
                      type="number"
                      value={selectedSvg.price || ''} // Handle potential undefined/null
                      onChange={(e) => setSelectedSvg({ ...selectedSvg, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-instagram" className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram Link (Optional)
                    </label>
                    <input
                      id="edit-instagram"
                      type="url"
                      value={selectedSvg.instagram_link || ''}
                      onChange={(e) => setSelectedSvg({ ...selectedSvg, instagram_link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    value={selectedSvg.description || ''} // Handle potential undefined/null
                    onChange={(e) => setSelectedSvg({ ...selectedSvg, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                {/* --- Options --- */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium">Options</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Checkboxes... */}
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selectedSvg.iseditable}
                        onChange={(e) => setSelectedSvg({ ...selectedSvg, iseditable: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Editable</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selectedSvg.featureOnInstagram}
                        onChange={(e) => setSelectedSvg({ ...selectedSvg, featureOnInstagram: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Feature in Instagram Section</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selectedSvg.isfeatured}
                        onChange={(e) => setSelectedSvg({ ...selectedSvg, isfeatured: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Featured (General)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selectedSvg.isbanner}
                        onChange={(e) => setSelectedSvg({ ...selectedSvg, isbanner: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Show in Banner</span>
                    </label>
                  </div>
                </div>

                {/* --- SVG Preview and Editable Colors --- */}
                {selectedSvg.iseditable && (
                  <div className="border-t pt-4 space-y-4">
                    <h3 className="text-lg font-medium">SVG Preview & Editable Colors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* SVG Preview Column */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SVG Preview
                        </label>
                        {svgUrlForEditing ? (
                          <div className="border rounded-md p-2 aspect-square flex items-center justify-center bg-gray-50">
                            <img
                              src={svgUrlForEditing}
                              alt="SVG Preview"
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => e.target.style.display = 'none'} // Hide if image fails to load
                            />
                          </div>
                        ) : (
                          <div className="border rounded-md p-4 aspect-square flex items-center justify-center bg-gray-100 text-gray-500 text-center">
                            {isExtractingColors ? "Loading SVG..." : "No .svg file found or provided for preview."}
                          </div>
                        )}
                      </div>

                      {/* Editable Colors Column */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Editable Colors
                        </label>
                        {isExtractingColors ? (
                          <div className="text-sm text-gray-500">Extracting colors...</div>
                        ) : !svgUrlForEditing ? (
                          <div className="text-sm text-gray-500">Cannot extract colors without a valid .svg file.</div>
                        ) : extractedColors.length > 0 ? (
                          <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2 bg-white">
                            {extractedColors.map((color, index) => (
                              <label key={`${color}-${index}`} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                <input
                                  type="checkbox"
                                  checked={selectedSvg.editablecolors?.includes(color)}
                                  onChange={(e) => {
                                    const currentEditable = selectedSvg.editablecolors || [];
                                    const newColors = e.target.checked
                                      ? [...currentEditable, color]
                                      : currentEditable.filter(c => c !== color);
                                    // Remove duplicates just in case
                                    const uniqueNewColors = Array.from(new Set(newColors));
                                    setSelectedSvg({ ...selectedSvg, editablecolors: uniqueNewColors });
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <div
                                  className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                                  style={{ backgroundColor: color }}
                                  title={color} // Show color code on hover
                                />
                                <span className="text-sm font-mono truncate">{color}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No colors extracted from this SVG or extraction failed.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- Actions --- */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closeEditModal} // Use dedicated close function
                    className="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <Toaster position="bottom-right" /> {/* Good position for toasts */}
    </>
  );
}