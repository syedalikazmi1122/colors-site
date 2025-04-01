import React from 'react';
import { Grid, List } from 'lucide-react';

export function CategoryHeader() {
  return (
    <div className="flex items-center justify-between pb-6">
      
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Grid size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <List size={20} />
          </button>
        </div>
        <span className="text-sm text-gray-700">100 products</span>
        <select className="border-gray-300 rounded-md text-sm">
          <option>Sort by</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
        </select>
      
    </div>
  );
}