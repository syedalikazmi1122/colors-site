import React from 'react';
import { Grid, List } from 'lucide-react';

export function CategoryHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 space-y-4 md:space-y-0">
      
      {/* View toggle buttons */}
      {/* <div className="flex items-center space-x-2">
        {/* <button className="p-2 hover:bg-gray-100 rounded-md">
          <Grid size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <List size={20} />
        </button> */}
      {/* </div> */} 

      {/* Product count */}
      <span className="text-sm text-gray-700 md:order-2">100 products</span>

      {/* Sort dropdown */}
      <select className="border border-gray-300 rounded-md text-sm px-2 py-1 md:order-3">
        <option>Sort by</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Newest</option>
      </select>
      
    </div>
  );
}
