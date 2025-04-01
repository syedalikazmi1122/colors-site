import React from 'react';
import { CategoryFilters } from './CategoryFilter';
import { CategoryHeader } from './CategoriesHeader';
import { ProductGrid } from './ProductGrid';
import { CategoryFooter } from './CategoryFooter';

export default function CategoryLayout() {
    return (
        <div className="  px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex">
                <CategoryFilters />
                <div className="flex-1">
                    <CategoryHeader />
                    <ProductGrid />
                </div>
            </div>
            <CategoryFooter />
        </div>
    );
}