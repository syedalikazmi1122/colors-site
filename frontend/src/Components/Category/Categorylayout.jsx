// CategoryLayout.jsx
"use client"; // Add this if using Next.js App Router

import React, { useState, useEffect, useMemo } from 'react';
import { CategoryFilters } from './CategoryFilter'; // Assuming CategoryFilter.jsx
import { CategoryHeader } from './CategoriesHeader'; // Assuming CategoriesHeader.jsx
import { ProductGrid } from './ProductGrid'; // Assuming ProductGrid.jsx

export default function CategoryLayout({ categoryData = [] }) { // Default to empty array
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- Filter State (Lifted Up) ---
  const [filters, setFilters] = useState({
    inStockOnly: false,
    minPrice: '', // Store as string for input control
    maxPrice: '', // Store as string for input control
    // Add states for other filters as needed (productType, finish, color)
    // Example: selectedProductTypes: [], selectedFinishes: [], selectedColors: []
  });

  // --- Sort State ---
  const [sortBy, setSortBy] = useState('default'); // e.g., 'default', 'price-asc', 'price-desc', 'name-asc'

  // --- Toggle Mobile Filter Menu ---
  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // --- Handler to Update Filters from Child ---
  const handleFilterChange = (filterName, value) => {
    console.log("Filter Change:", filterName, value);
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
    // Close mobile filter menu after applying a filter (optional)
    // if (isFilterOpen) setIsFilterOpen(false);
  };

  // --- Handler to Update Sorting ---
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedProducts = useMemo(() => {
    let processedData = [...categoryData]; // Start with a copy of original data

    // 1. Apply Filters
    // In Stock (Assuming your data has an `inStock` or similar boolean field)
    if (filters.inStockOnly) {
       // Replace `item.inStock` with your actual field name if different
      processedData = processedData.filter(item => item.inStock === true);
    }

    // Price Filter
    const minPriceNum = parseFloat(filters.minPrice);
    const maxPriceNum = parseFloat(filters.maxPrice);

    if (!isNaN(minPriceNum) && minPriceNum >= 0) {
      processedData = processedData.filter(item => item.price >= minPriceNum);
    }
    if (!isNaN(maxPriceNum) && maxPriceNum >= 0) {
      processedData = processedData.filter(item => item.price <= maxPriceNum);
    }
    // Add filtering for productType, finish, color based on your data structure
    // Example (assuming `item.productType` is a string and `filters.selectedProductTypes` is an array):
    // if (filters.selectedProductTypes.length > 0) {
    //   processedData = processedData.filter(item => filters.selectedProductTypes.includes(item.productType));
    // }

    // 2. Apply Sorting
    switch (sortBy) {
      case 'price-asc':
        processedData.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        processedData.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        processedData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
         processedData.sort((a, b) => b.title.localeCompare(a.title));
         break;
      // Add cases for 'featured', 'newest', etc. if needed
      case 'default':
      default:
        // No sorting or sort by default criteria (e.g., relevance, original order)
        break;
    }

    return processedData;
  }, [categoryData, filters, sortBy]); // Recalculate when data, filters, or sort changes

  return (
    <div className="w-full">
      {/* Mobile Header */}
      <div className="sm:hidden border-b border-gray-200">
        <div className="flex justify-between items-center p-4">
          <button
            onClick={toggleFilterMenu}
            className="text-gray-900 font-medium text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" // Added some style
            aria-expanded={isFilterOpen}
            aria-controls="filter-sidebar"
          >
            Filter
          </button>
          {/* --- Mobile Sort Dropdown --- */}
          <div className="flex items-center">
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="appearance-none bg-transparent pr-8 pl-2 py-1 text-sm border-l border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-sm"
                aria-label="Sort products"
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                {/* Add more sort options */}
              </select>
              {/* Dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="flex flex-col sm:flex-row">
        {/* Filters Sidebar */}
        <div
          id="filter-sidebar" // Added ID for ARIA control
          // ** NOTE: Consider Tailwind UI's Slide-over or Drawer for better mobile UX **
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:sticky sm:top-0 sm:translate-x-0 sm:shadow-none sm:w-64 sm:border-r sm:border-gray-200 sm:h-screen sm:overflow-y-auto`} // Adjusted for sticky desktop
        >
           {/* Mobile Filter Header */}
          <div className="sm:hidden p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Filters</h2>
            <button
              onClick={toggleFilterMenu}
              className="p-1 text-gray-500 hover:text-gray-900 focus:outline-none rounded-full hover:bg-gray-100"
              aria-label="Close filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Pass filters state and handler down */}
          <CategoryFilters filters={filters} onFilterChange={handleFilterChange} />
           {/* Optional: Add Apply/Clear buttons for mobile */}
           <div className="sm:hidden p-4 border-t">
                <button
                  onClick={toggleFilterMenu} // Or a dedicated Apply function
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-md text-sm"
                >
                    View Results ({filteredAndSortedProducts.length})
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Desktop Header - Pass sort state and handler */}
          <div className="hidden sm:block mb-6">
            <CategoryHeader sortBy={sortBy} onSortChange={handleSortChange} totalResults={filteredAndSortedProducts.length}/>
          </div>

          {/* Products Grid - Pass filtered and sorted data */}
          {filteredAndSortedProducts.length > 0 ? (
              <ProductGrid categoryData={filteredAndSortedProducts} />
          ) : (
              <div className='text-center py-10 text-gray-500'>
                  No products match your current filters.
              </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile filter menu */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={toggleFilterMenu}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}