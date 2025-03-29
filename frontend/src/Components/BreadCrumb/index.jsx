import React from "react";

export default function BreadCrumb() {
    return (
        <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-40 mt-10 md:mt-20 px-4 sm:px-6 bg-gray-100 lg:px-8 py-12 md:py-24">
            <div className="flex items-center space-x-2">
                <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
                <span className="text-gray-500">/</span>
                <a href="/products" className="text-gray-500 hover:text-gray-700">Products</a>
                <span className="text-gray-500">/</span>
                <span className="text-gray-700 font-semibold">Product Name</span>
            </div>
        </div>
    )
}