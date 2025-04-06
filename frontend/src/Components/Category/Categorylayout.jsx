import React, { useState } from 'react';
import { CategoryFilters } from './CategoryFilter';
import { CategoryHeader } from './CategoriesHeader';
import { ProductGrid } from './ProductGrid';

export default function CategoryLayout({ categoryData }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  return (
    <div className="w-full">
      {/* Mobile header - similar to Image 1 */}
      <div className="sm:hidden border-b border-gray-200">
        <div className="flex justify-between items-center p-4">
          <button 
            onClick={toggleFilterMenu}
            className="text-gray-900 font-medium text-sm"
          >
            Filter
          </button>
          <div className="flex items-center">
            <div className="relative">
              <select className="appearance-none bg-transparent pr-8 pl-2 py-1 text-sm border-r border-gray-200">
                <option>Sort by</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Desktop layout - similar to Image 2 */}
      <div className="flex flex-col sm:flex-row">
        {/* Filters Sidebar - fixed on mobile, always visible on desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:relative sm:translate-x-0 sm:shadow-none sm:w-64 sm:border-r sm:border-gray-200`}
        >
          <div className="sm:hidden p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Filters</h2>
            <button
              onClick={toggleFilterMenu}
              className="text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              X
            </button>
          </div>
          <CategoryFilters />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Desktop header component */}
          <div className="hidden sm:block">
            <CategoryHeader />
          </div>
          
          {/* Products Grid */}
          <ProductGrid categoryData={categoryData} />
        </div>
      </div>
      
      {/* Overlay for mobile filter menu */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={toggleFilterMenu}
        ></div>
      )}
    </div>
  );
}