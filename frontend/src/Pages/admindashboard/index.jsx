import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Download, Star, Filter, Image } from 'lucide-react';
import sendRequest from '../../Utils/apirequest';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../../Components/Footer';
import deleteImage from '../../Utils/deleteImage';
import SvgImageCarousel from './svgImageCasousel';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import StatCards from './StatCards';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [svgs, setSvgs] = useState([]);
  const [selectedSvg, setSelectedSvg] = useState(null);
  const [svgUrlForEditing, setSvgUrlForEditing] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [extractedColors, setExtractedColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [materialInput, setMaterialInput] = useState(selectedSvg?.material?.join(', ') || '');

  useEffect(() => {
    fetchSvgs();
  }, [categoryFilter]);

  // Extract unique categories from SVGs for filtering
  useEffect(() => {
    if (svgs.length > 0) {
      const uniqueCategories = Array.from(new Set(svgs.map(svg => svg.category))).filter(Boolean);
      setCategories(uniqueCategories);
    }
  }, [svgs]);

  const fetchSvgs = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '/svgs';
      if (categoryFilter) {
        endpoint += `?category=${encodeURIComponent(categoryFilter)}`;
      }
      
      const response = await sendRequest('GET', endpoint, null);
      if (response.error) throw response.error;
      
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

  const extractColorsFromSvg = async (url) => {
    setIsExtractingColors(true);
    setExtractedColors([]);
    setError(null);
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

      // Match named colors within attributes
      const namedColorRegex = /(?:fill|stroke|stop-color|color)\s*=\s*"([a-zA-Z]+)"/gi;
      let match;
      while ((match = namedColorRegex.exec(svgText)) !== null) {
        const colorName = match[1].toLowerCase();
        if (colorName !== 'none' && colorName !== 'transparent' && colorName !== 'currentcolor') {
          if (/^[a-zA-Z]+$/.test(colorName)) {
            uniqueColors.add(colorName);
          }
        }
      }

      // Match style attribute colors
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

      // Filter out potential non-color strings
      const finalColors = Array.from(uniqueColors).filter(color =>
        color.startsWith('#') || color.startsWith('rgb') || /^[a-zA-Z]+$/.test(color)
      );

      setExtractedColors(finalColors);
      return finalColors;

    } catch (error) {
      console.error('Error extracting colors:', error);
      setError(`Failed to extract colors: ${error.message}. Check SVG file access and format.`);
      toast.error(`Failed to extract colors: ${error.message}`);
      return [];
    } finally {
      setIsExtractingColors(false);
    }
  };

  const handleEdit = async (svg) => {
    const svgFileUrl = svg.url.find(url => typeof url === 'string' && url.toLowerCase().endsWith('.svg'));

    if (!svgFileUrl) {
      toast.error("Could not find the .svg file for this design to extract colors.");
      console.error("SVG file URL not found in:", svg.url);
      setSelectedSvg({
        ...svg,
        editablecolors: svg.editablecolors || [],
         productID: svg.productId || ''
      });
      setSvgUrlForEditing('');
      setExtractedColors([]);
      setIsEditModalOpen(true);
      return;
    }

    setSvgUrlForEditing(svgFileUrl);
    setSelectedSvg({
      ...svg,
      title: svg.title,
      editablecolors: svg.editablecolors || []
    });
    setIsEditModalOpen(true);
    await extractColorsFromSvg(svgFileUrl);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedSvg) return;

    const updatedSvgData = {
      ...selectedSvg,
      price: parseFloat(selectedSvg.price) || 0,
    };
    delete updatedSvgData.svgFileUrl;

    try {
      const response = await sendRequest('PUT', `/svgs/${selectedSvg._id}`, updatedSvgData);

      if (response.status === 200 || response.status === 201) {
        toast.success('Design updated successfully!');
        setIsEditModalOpen(false);
        fetchSvgs();
        setSelectedSvg(null);
        setSvgUrlForEditing('');
        setExtractedColors([]);
      } else {
        const errorMsg = response.error?.message || response.data?.message || 'Failed to update design!';
        toast.error(errorMsg);
        setError(errorMsg);
      }

    } catch (err) {
      console.error("Update error:", err);
      const errorMsg = err.message || 'An unexpected error occurred during update.';
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  const handleDelete = async (id, urlsToDelete) => {
    if (!window.confirm('Are you sure you want to delete this design and its associated files?')) return;

    try {
      console.log("Attempting to delete files:", urlsToDelete);
      const deleteFileResponse = await deleteImage(urlsToDelete);

      if (deleteFileResponse.error) {
        console.error("Error deleting files from storage:", deleteFileResponse.error);
        toast.error(`Storage cleanup issue: ${deleteFileResponse.error.message}. Attempting DB delete...`);
      } else {
        console.log("Storage deletion response:", deleteFileResponse.data);
        toast.success("Associated files deleted from storage.");
      }

      const response = await sendRequest('DELETE', `/svgs/${id}`, {});

      if (response.status === 200 || response.status === 204) {
        toast.success('Design deleted successfully!');
        fetchSvgs();
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

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSvg(null);
    setSvgUrlForEditing('');
    setExtractedColors([]);
    setError(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading && !svgs.length) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          <span className="ml-3">Loading Designs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="lg:pl-64 pt-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-serif mb-2">Design Management</h1>
            <p className="text-gray-600">Create, edit and manage your SVG designs</p>
          </div>


          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-medium">SVG Designs</h2>
              <div className="flex items-center bg-white px-3 py-1.5 rounded-md border shadow-sm">
                <Filter size={16} className="text-gray-400 mr-2" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-sm bg-transparent border-none focus:ring-0 pr-8"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/admin/orders')}
                className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span>View Orders</span>
              </button>
              
              <a
                href="/admin/upload"
                className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded shadow-sm hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New</span>
              </a>
            </div>
          </div>

          {error && !isEditModalOpen && (
            <div className="text-red-500 text-center p-4 mb-4 border border-red-300 bg-red-50 rounded">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {svgs.map((svg) => (
              <div key={svg._id} className="bg-white border rounded shadow-sm hover:shadow-md transition-shadow p-4 space-y-4 flex flex-col">
                <div className="aspect-square bg-gray-100 rounded overflow-hidden relative mb-4">
                  <SvgImageCarousel
                    urls={svg.url}
                    alt={svg.title?.en}
                    className="w-full h-full object-contain"
                  />
                  
                  {svg.isfeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-sm flex items-center">
                      <Star size={12} className="mr-1" />
                      Featured
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-grow">
                  <h3 className="text-lg font-medium">{svg?.title?.en}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm px-2 py-0.5 bg-gray-100 rounded-sm text-gray-700">{svg.category}</span>
                    <span className="font-medium text-gray-900">${svg.price?.toFixed(2)}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {svg.iseditable && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Editable
                      </span>
                    )}
                    {svg.featureOnInstagram && (
                      <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                        Instagram
                      </span>
                    )}
                    {svg.isbanner && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Banner
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between space-x-2 pt-2 mt-auto border-t">
                  <button
                    onClick={() => window.open(svg.url[0], '_blank')}
                    className="flex items-center justify-center py-1.5 px-3 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Download size={16} className="mr-1.5" />
                    Preview
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(svg)}
                      className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label={`Edit ${svg.title?.en}`}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(svg._id, svg.url)}
                      className="p-2 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-colors"
                      aria-label={`Delete ${svg.title?.en}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {svgs.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <div className="flex justify-center">
                <Image size={48} className="text-gray-300" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No designs found</h3>
              <p className="mt-1 text-gray-500">Get started by creating your first design</p>
              <div className="mt-6">
                <a
                  href="/admin/upload"
                  className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  <Plus size={16} />
                  <span>Upload New Design</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Edit Modal */}
      {isEditModalOpen && selectedSvg && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 sticky top-0 bg-white border-b z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif">Edit Design: {selectedSvg?.title?.en}</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title (English)
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    value={selectedSvg?.title?.en || ''}
                    onChange={async (e) => {
                      const englishTitle = e.target.value;
                      try {
                        // Translate to Spanish
                        const esResponse = await sendRequest('POST', '/translate', {
                          text: englishTitle,
                          targetLanguage: 'es'
                        });
                        
                        // Translate to French
                        const frResponse = await sendRequest('POST', '/translate', {
                          text: englishTitle,
                          targetLanguage: 'fr'
                        });
                        
                        // Translate to German
                        const deResponse = await sendRequest('POST', '/translate', {
                          text: englishTitle,
                          targetLanguage: 'de'
                        });

                        setSelectedSvg({ 
                          ...selectedSvg, 
                          title: {
                            en: englishTitle,
                            es: esResponse.data.translatedText,
                            fr: frResponse.data.translatedText,
                            de: deResponse.data.translatedText
                          }
                        });
                      } catch (error) {
                        console.error('Translation error:', error);
                        // If translation fails, at least update the English title
                        setSelectedSvg({ 
                          ...selectedSvg, 
                          title: {
                            ...selectedSvg.title,
                            en: englishTitle
                          }
                        });
                        toast.error('Failed to translate title. Only English title was updated.');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                    value={selectedSvg.price || ''}
                    onChange={(e) => setSelectedSvg({ ...selectedSvg, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label htmlFor="edit-material" className="block text-sm font-medium text-gray-700 mb-1">
                    Material (comma separated)
                  </label>
                  <input
                    id="edit-material"
                    type="text"
                    value={materialInput}
                    onChange={async (e) => {
                      const materials = e.target.value.split(',').map(m => m.trim()).filter(Boolean);
                      setMaterialInput(e.target.value);
                      
                      try {
                        // Create an array of material objects with translations
                        const translatedMaterials = await Promise.all(
                          materials.map(async (material) => {
                            // Translate to Spanish
                            const esResponse = await sendRequest('POST', '/translate', {
                              text: material,
                              targetLanguage: 'es'
                            });
                            
                            // Translate to French
                            const frResponse = await sendRequest('POST', '/translate', {
                              text: material,
                              targetLanguage: 'fr'
                            });
                            
                            // Translate to German
                            const deResponse = await sendRequest('POST', '/translate', {
                              text: material,
                              targetLanguage: 'de'
                            });

                            return {
                              en: material,
                              es: esResponse.data.translatedText,
                              fr: frResponse.data.translatedText,
                              de: deResponse.data.translatedText
                            };
                          })
                        );

                        setSelectedSvg({
                          ...selectedSvg,
                          material: translatedMaterials
                        });
                      } catch (error) {
                        console.error('Translation error:', error);
                        // If translation fails, at least update with English materials
                        setSelectedSvg({
                          ...selectedSvg,
                          material: materials.map(material => ({
                            en: material,
                            es: '',
                            fr: '',
                            de: ''
                          }))
                        });
                        toast.error('Failed to translate materials. Only English materials were updated.');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Paper, Vinyl, Fabric"
                  />
                </div>
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (English)
                  </label>
                  <textarea
                    id="edit-description"
                    value={selectedSvg?.description?.en || ''}
                    onChange={async (e) => {
                      const englishDescription = e.target.value;
                      try {
                        // Translate to Spanish
                        const esResponse = await sendRequest('POST', '/translate', {
                          text: englishDescription,
                          targetLanguage: 'es'
                        });
                        
                        // Translate to French
                        const frResponse = await sendRequest('POST', '/translate', {
                          text: englishDescription,
                          targetLanguage: 'fr'
                        });
                        
                        // Translate to German
                        const deResponse = await sendRequest('POST', '/translate', {
                          text: englishDescription,
                          targetLanguage: 'de'
                        });

                        setSelectedSvg({ 
                          ...selectedSvg, 
                          description: {
                            en: englishDescription,
                            es: esResponse.data.translatedText,
                            fr: frResponse.data.translatedText,
                            de: deResponse.data.translatedText
                          }
                        });
                      } catch (error) {
                        console.error('Translation error:', error);
                        // If translation fails, at least update the English description
                        setSelectedSvg({ 
                          ...selectedSvg, 
                          description: {
                            ...selectedSvg.description,
                            en: englishDescription
                          }
                        });
                        toast.error('Failed to translate description. Only English description was updated.');
                      }
                    }}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-material-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Material Description (English)
                  </label>
                  <textarea
                    id="edit-material-description"
                    value={selectedSvg?.materialDescription?.en || ''}
                    onChange={async (e) => {
                      const englishMaterialDesc = e.target.value;
                      try {
                        // Translate to Spanish
                        const esResponse = await sendRequest('POST', '/translate', {
                          text: englishMaterialDesc,
                          targetLanguage: 'es'
                        });
                        
                        // Translate to French
                        const frResponse = await sendRequest('POST', '/translate', {
                          text: englishMaterialDesc,
                          targetLanguage: 'fr'
                        });
                        
                        // Translate to German
                        const deResponse = await sendRequest('POST', '/translate', {
                          text: englishMaterialDesc,
                          targetLanguage: 'de'
                        });

                        setSelectedSvg({ 
                          ...selectedSvg, 
                          materialDescription: {
                            en: englishMaterialDesc,
                            es: esResponse.data.translatedText,
                            fr: frResponse.data.translatedText,
                            de: deResponse.data.translatedText
                          }
                        });
                      } catch (error) {
                        console.error('Translation error:', error);
                        // If translation fails, at least update the English material description
                        setSelectedSvg({ 
                          ...selectedSvg, 
                          materialDescription: {
                            ...selectedSvg.materialDescription,
                            en: englishMaterialDesc
                          }
                        });
                        toast.error('Failed to translate material description. Only English description was updated.');
                      }
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe the material(s) used for this design."
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">Options</h3>
                <div className="grid grid-cols-2 gap-4">
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
                      checked={!!selectedSvg.ismeasureable}
                      onChange={(e) => setSelectedSvg({ ...selectedSvg, ismeasureable: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Measureable</span>
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

              {selectedSvg.iseditable && (
                <div className="border-t pt-4 space-y-4">
                  <h3 className="text-lg font-medium">SVG Preview & Editable Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      ) : (
                        <div className="border rounded-md p-4 aspect-square flex items-center justify-center bg-gray-100 text-gray-500 text-center">
                          {isExtractingColors ? "Loading SVG..." : "No .svg file found or provided for preview."}
                        </div>
                      )}
                    </div>

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
                                  const uniqueNewColors = Array.from(new Set(newColors));
                                  setSelectedSvg({ ...selectedSvg, editablecolors: uniqueNewColors });
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <div
                                className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
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

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Toaster position="bottom-right" />
    </div>
  );
}