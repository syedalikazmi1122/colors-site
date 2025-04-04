import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Footer from '../../Components/Footer';
import Navbar from '../../Components/Navbar';

const categories = [
  'Wallpaper',
  'Kids Wallpaper',
  'Murals',
  'Rugs',
  'Wall Decor'
];

export function AdminUpload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      setFormData({
        ...formData,
        file
      });
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle upload logic here
    console.log('Upload attempt:', formData);
  };

  const clearFile = () => {
    setFormData({
      ...formData,
      file: null
    });
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>  
    <Navbar/>
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-2">Upload SVG</h1>
          <p className="text-gray-600 text-sm">
            Add new SVG designs to the collection
          </p>
        </div>

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
                  <option key={category} value={category}>
                    {category}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SVG File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-gray-900 hover:text-gray-700">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        ref={fileInputRef}
                        className="sr-only"
                        accept=".svg"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    SVG files only
                  </p>
                </div>

                {previewUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-32 w-auto"
                      />
                      <button
                        type="button"
                        onClick={clearFile}
                        className="absolute -top-2 -right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              UPLOAD DESIGN
            </button>
          </div>
        </form>
      </div>
    </div>
<Footer/>
    </>

  );
}