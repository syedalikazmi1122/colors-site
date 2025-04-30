import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function CategoryFilters({ filters, onFilterChange }) {
  const [sections, setSections] = useState({
    availability: false,
    price: false,
    productType: false,
    finish: false,
    color: false
  });

  const toggleSection = (section) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handler for simple checkbox/toggle filters
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    onFilterChange(name, checked);
  };

  // Handler for price inputs
  const handlePriceInputChange = (event) => {
    const { name, value } = event.target;
    const sanitizedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    onFilterChange(name, sanitizedValue);
  };

  return (
    <div className="w-full border-r border-gray-200">
      {/* Availability Filter */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('availability')}
          aria-expanded={sections.availability}
        >
          <h3 className="text-base font-medium text-gray-900">Availability</h3>
          {sections.availability ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {sections.availability && (
          <div className="px-4 py-2 mb-2 space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="inStockOnly"
                checked={filters.inStockOnly}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700">In stock only</span>
            </label>
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('price')}
          aria-expanded={sections.price}
        >
          <h3 className="text-base font-medium text-gray-900">Price</h3>
          {sections.price ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {sections.price && (
          <div className="px-4 py-2 mb-2 space-y-3">
            <div className="flex items-center justify-between space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handlePriceInputChange}
                  className="w-full border border-gray-300 rounded-md pl-5 pr-2 py-1 text-sm focus:ring-gray-700 focus:border-gray-700"
                  placeholder="Min"
                  aria-label="Minimum price"
                />
              </div>
              <span className="text-gray-500 text-sm">to</span>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handlePriceInputChange}
                  className="w-full border border-gray-300 rounded-md pl-5 pr-2 py-1 text-sm focus:ring-gray-700 focus:border-gray-700"
                  placeholder="Max"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Type Filter */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('productType')}
          aria-expanded={sections.productType}
        >
          <h3 className="text-base font-medium text-gray-900">Product type</h3>
          {sections.productType ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {sections.productType && (
          <div className="px-4 py-2 mb-2 space-y-2">
            {/* Product type options would go here */}
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="productType_furniture"
                checked={filters.productType_furniture}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700">Furniture</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="productType_decor"
                checked={filters.productType_decor}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700">Decor</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="productType_lighting"
                checked={filters.productType_lighting}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700">Lighting</span>
            </label>
          </div>
        )}
      </div>

      {/* Finish Filter */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('finish')}
          aria-expanded={sections.finish}
        >
          <h3 className="text-base font-medium text-gray-900">Finish</h3>
          {sections.finish ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {sections.finish && (
          <div className="px-4 py-2 mb-2 space-y-2">
            {/* Finish options would go here */}
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="finish_matte"
                checked={filters.finish_matte}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700">Matte</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="finish_glossy"
                checked={filters.finish_glossy}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700">Glossy</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="finish_natural"
                checked={filters.finish_natural}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700">Natural</span>
            </label>
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('color')}
          aria-expanded={sections.color}
        >
          <h3 className="text-base font-medium text-gray-900">Color</h3>
          {sections.color ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {sections.color && (
          <div className="px-4 py-2 mb-2">
            {/* Color options with swatches */}
            <div className="grid grid-cols-4 gap-2">
              {['#F9F9F9', '#000000', '#A67F5D', '#3A7D7B', '#7D4E57', '#6F3E37', '#8E8E8E', '#5A7C63'].map((color, index) => (
                <button
                  key={index}
                  className="w-8 h-8 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  style={{ backgroundColor: color }}
                  onClick={() => onFilterChange('selectedColor', color)}
                  aria-label={`Select color ${index + 1}`}
                />
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="color_white"
                  checked={filters.color_white}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700">White</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="color_black"
                  checked={filters.color_black}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700">Black</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="color_beige"
                  checked={filters.color_beige}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700">Beige</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="color_green"
                  checked={filters.color_green}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700">Green</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}