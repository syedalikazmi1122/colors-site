// CategoriesHeader.jsx
import React from 'react';

// Accept sortBy state and handler function
export function CategoryHeader({ sortBy, onSortChange, totalResults = 0 }) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <div>
        {/* You might want to display the category name here if available */}
        <h1 className="text-2xl font-medium text-gray-900">Products</h1>
        <p className="text-sm text-gray-500 mt-1">{totalResults} results</p>
      </div>
      <div className="relative">
         <label htmlFor="desktop-sort" className="sr-only">Sort products</label>
        <select
          id="desktop-sort"
          value={sortBy}
          onChange={onSortChange} // Use the passed handler
          className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
        >
          <option value="default">Sort by: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          {/* Add more sort options */}
        </select>
        {/* Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}