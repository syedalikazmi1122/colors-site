import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function CategoryFilters() {
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

  return (
    <div className="w-full sm:w-64 flex-shrink-0 sm:pr-4 p-3">
      <div className="divide-y divide-gray-200">
        {/* Availability Filter */}
        <div className="py-4">
          <button 
            className="flex items-center justify-between w-full group"
            onClick={() => toggleSection('availability')}
          >
            <h3 className="text-base font-medium text-gray-900">Availability</h3>
            {sections.availability ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {sections.availability && (
            <div className="mt-4">
              <label className="inline-flex items-center">
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                </div>
                <span className="text-sm text-gray-700">In stock only</span>
              </label>
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="py-4">
          <button 
            className="flex items-center justify-between w-full group"
            onClick={() => toggleSection('price')}
          >
            <h3 className="text-base font-medium text-gray-900">Price</h3>
            {sections.price ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {sections.price && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">$</span>
                  <input 
                    type="number" 
                    className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm" 
                    placeholder="0" 
                  />
                </div>
                <span className="text-gray-500">to</span>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">$</span>
                  <input 
                    type="number" 
                    className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm" 
                    placeholder="269" 
                  />
                </div>
              </div>
              <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-md text-sm hover:bg-gray-800 transition-colors">
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Product Type Filter */}
        <div className="py-4">
          <button 
            className="flex items-center justify-between w-full group"
            onClick={() => toggleSection('productType')}
          >
            <h3 className="text-base font-medium text-gray-900">Product type</h3>
            {sections.productType ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {sections.productType && (
            <div className="mt-4 space-y-2">
              <button className="w-full text-left py-1 text-sm text-gray-700 hover:text-gray-900">
                All Products
              </button>
            </div>
          )}
        </div>

        {/* Finish Filter */}
        <div className="py-4">
          <button 
            className="flex items-center justify-between w-full group"
            onClick={() => toggleSection('finish')}
          >
            <h3 className="text-base font-medium text-gray-900">Finish</h3>
            {sections.finish ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {sections.finish && (
            <div className="mt-4 space-y-2">
              <button className="w-full text-left py-1 text-sm text-gray-700 hover:text-gray-900">
                All Finishes
              </button>
            </div>
          )}
        </div>

        {/* Color Filter */}
        <div className="py-4">
          <button 
            className="flex items-center justify-between w-full group"
            onClick={() => toggleSection('color')}
          >
            <h3 className="text-base font-medium text-gray-900">Color</h3>
            {sections.color ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {sections.color && (
            <div className="mt-4 space-y-2">
              <button className="w-full text-left py-1 text-sm text-gray-700 hover:text-gray-900">
                All Colors
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}