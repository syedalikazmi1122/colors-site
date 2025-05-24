import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Footer from '../../Components/Footer';
import uploadImage from '../../Utils/uploadimage';
import sendRequest from '../../Utils/apirequest';
import Navbar from '../../Components/Navbar';
import toast, { Toaster } from 'react-hot-toast';

const categories = [
  { name: 'Wallpaper', slug: 'wallpaper' },
  { name: 'Kids Wallpaper', slug: 'kids-wallpaper' },
  { name: 'Murals', slug: 'murals' },
  { name: 'Rugs', slug: 'rugs' },
  { name: 'Wall Decor', slug: 'wall-decor' }
];

export function AdminUpload() {
  const [formData, setFormData] = useState({
    title: '',
    productID:'',
    description: '',
    category: '',
    price: 0,
    files: [],
    iseditable: false,
    isfeatured: false,
    isbanner: false,
    instagram_link: '',
    editablecolors: []
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedColors, setExtractedColors] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  const extractColorsFromSvg = (svgText) => {
    const uniqueColors = new Set();
    
    const colorRegex = /(fill|stroke)="([^"]+)"|style="[^"]*(?:fill|stroke):\s*([^;"\s]+)/g;
    let match;
    
    while ((match = colorRegex.exec(svgText)) !== null) {
      const color = match[2] || match[3];
      if (color && color !== 'none' && color !== 'transparent') {
        uniqueColors.add(color);
      }
    }
    
    return Array.from(uniqueColors);
  };

  const validateFiles = (files) => {
    const svgFiles = files.filter(file => file.type === 'image/svg+xml');
    const pngFiles = files.filter(file => file.type === 'image/png');
    const jpgFiles = files.filter(file => file.type === 'image/jpeg');
    const otherFiles = files.filter(file => !['image/svg+xml', 'image/png', 'image/jpeg'].includes(file.type));


    if (svgFiles.length > 1) {
      throw new Error('Only one SVG file is allowed');
    }

    if (otherFiles.length > 0) {
      throw new Error('Only SVG , jpg and PNG files are allowed');
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    try {
      validateFiles(selectedFiles);

      // Create preview URLs and extract colors from SVG if present
      const urls = [];
      const svgFile = selectedFiles.find(file => file.type === 'image/svg+xml');

      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          urls.push({ url: reader.result, type: file.type });
          
          if (urls.length === selectedFiles.length) {
            setPreviewUrls(prev => [...prev, ...urls]);
          }

          // Extract colors if it's an SVG file
          if (file === svgFile) {
            const colors = extractColorsFromSvg(reader.result);
            setExtractedColors(prev => [...new Set([...prev, ...colors])]);
            setFormData(prev => ({
              ...prev,
              iseditable: true
            }));
          }
        };
        reader.readAsDataURL(file);
      });

      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...selectedFiles]
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
      clearFiles();
    }
  };

  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      editablecolors: prev.editablecolors.includes(color)
        ? prev.editablecolors.filter(c => c !== color)
        : [...prev.editablecolors, color]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.files.length === 0) {
        throw new Error('Please select at least one file');
      }
       if (!/^\d{5}$/.test(formData.productID)) {
  throw new Error('Product ID must be exactly 5 digits');
}
   console.log("upload files")
      // Upload all files
      const uploadedUrls = await Promise.all(
        formData.files.map(file => uploadImage(file))
      );

      if (uploadedUrls.some(url => !url)) {
        throw new Error('Failed to upload one or more files');
      }

      const backendData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        url: uploadedUrls,
        price: formData.price,
        iseditable: formData.iseditable,
        isfeatured: formData.isfeatured,
        isbanner: formData.isbanner,
        instagram_link: formData.instagram_link,
        editablecolors: formData.editablecolors,
        productID: formData.productID,
        fileTypes: formData.files.map(file => file.type)
      };

      const response = await sendRequest('POST', '/upload-svg', backendData);
      if (response.status === 201) {
        toast.success('Design uploaded successfully!');
        clearFiles();
        setFormData({
          title: '',
          productID:"",
          description: '',
          category: '',
          price: 0,
          files: [],
          iseditable: false,
          isfeatured: false,
          isbanner: false,
          instagram_link: '',
          editablecolors: []
        });
      } else {
        toast.error('Failed to upload design!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFiles = () => {
    setFormData(prev => ({
      ...prev,
      files: [],
      iseditable: false
    }));
    setPreviewUrls([]);
    setExtractedColors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  const removeFile = (index) => {
    const newFiles = [...formData.files];
    const newPreviewUrls = [...previewUrls];
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    // If we removed the SVG file, reset editable state and colors
    if (formData.files[index].type === 'image/svg+xml') {
      setFormData(prev => ({
        ...prev,
        files: newFiles,
        iseditable: false,
        editablecolors: []
      }));
      setExtractedColors([]);
    } else {
      setFormData(prev => ({
        ...prev,
        files: newFiles
      }));
    }

    setPreviewUrls(newPreviewUrls);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-2">Upload Design</h1>
            <p className="text-gray-600 text-sm">
              Add new designs to the collection
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
                  placeholder="Enter design title"
                />
              </div>
               <div>
                <label htmlFor="productID" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Id
                </label>
                <input
                  type="text"
                  id="productID"
                  name="productID"
                  value={formData.productID                  }
                  onChange={handleChange}
                  required
                  min="0"
                  
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
                  placeholder="Enter design price"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
                  placeholder="Enter design price"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
                  placeholder="Enter design description"
                />
              </div>

              <div>
                <label htmlFor="instagram_link" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Link
                </label>
                <input
                  type="url"
                  id="instagram_link"
                  name="instagram_link"
                  value={formData.instagram_link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  {formData.files.some(file => file.type === 'image/svg+xml') && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="iseditable"
                        checked={formData.iseditable}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Editable</span>
                    </label>
                  )}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isfeatured"
                      checked={formData.isfeatured}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isbanner"
                      checked={formData.isbanner}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Banner</span>
                  </label>
                </div>
              </div>

              {formData.iseditable && extractedColors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Editable Colors</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {extractedColors.map((color, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.editablecolors.includes(color)}
                          onChange={() => handleColorToggle(color)}
                          className="rounded border-gray-300"
                        />
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Files
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-gray-900 hover:text-gray-700">
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          ref={fileInputRef}
                          className="sr-only"
                          accept=".svg,.png,.jpg"
                          onChange={handleFileChange}
                          multiple
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      One SVG file and multiple PNG files allowed
                    </p>
                  </div>
                </div>

                {/* Preview Grid */}
                {previewUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {previewUrls.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-square object-contain border rounded-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                          {preview.type === 'image/svg+xml' ? 'SVG' : 'PNG'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 hover:bg-gray-800'
                } focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
              >
                {loading ? 'Uploading...' : 'UPLOAD DESIGN'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <Toaster/>
    </>
  );
}