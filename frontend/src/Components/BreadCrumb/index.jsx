import React from "react";

export default function BreadCrumb() {
    return (
        <div className=" px-4 sm:px-6 bg-slate-50 lg:px-8 py-4 ">
            <div className="flex items-center space-x-2">
                <a href="/" className="text-gray-500 text-xs hover:text-gray-700">Home</a>
                <span className="text-gray-500">/</span>
                <a href="/products" className="text-xs text-gray-500 hover:text-gray-700">Products</a>
                          </div>
        </div>
    )
}