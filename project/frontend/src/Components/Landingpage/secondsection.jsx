import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sendRequest from "../../Utils/apirequest";
import Image1 from "./../../../src/Assets/1.jpg";
import Image2 from "./../../../src/Assets/2.jpg";
import Image3 from "./../../../src/Assets/3.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SecondSection() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await sendRequest('get', '/home', null);
        if (response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const defaultProducts = [
    {
      name: "Modern Bedroom Set",
      image: Image1,
      link: "/bedroom",
      price: 2999.99
    },
    {
      name: "Luxury Dining Table",
      image: Image2,
      link: "/dining",
      price: 1999.99
    },
    {
      name: "Contemporary Sofa",
      image: Image3,
      link: "/living-room",
      price: 2499.99
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;
  const itemsPerPage = 3;
  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  const visibleProducts = displayProducts.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif text-center mb-12 text-gray-900">
          Featured Collections
        </h2>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleProducts.map((product, index) => (
              <Link
                key={index}
                to={product.link || `/products/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-[1/1] overflow-hidden rounded-lg shadow-md">
                  <img
                    src={product.image || product.url?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-lg text-red-600 font-semibold">
                    ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}