import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sendRequest from "../../Utils/apirequest";
import Image7 from "./../../../src/Assets/7.jpg";
import Image8 from "./../../../src/Assets/8.jpg";
import Image9 from "./../../../src/Assets/9.jpg";
import Image10 from "./../../../src/Assets/10.jpg";
import Image11 from "./../../../src/Assets/12.jpg";
import Image12 from "./../../../src/Assets/13.jpg";

export default function ThirdSection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sendRequest('get', '/random-products', null);
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const defaultCategories = [
    {
      name: "All Bedroom",
      image: Image7,
      link: "/bedroom",
    },
    {
      name: "All Dining Room",
      image: Image8,
      link: "/dining-room",
    },
    {
      name: "All Living Room",
      image: Image9,
      link: "/living-room",
    },
    {
      name: "All Decor",
      image: Image10,
      link: "/decor",
    },
    {
      name: "All Artwork",
      image: Image11,
      link: "/artwork",
    },
    {
      name: "All Pillows",
      image: Image12,
      link: "/pillows",
    },
    {
      name: "All Lighting",
      image: Image7,
      link: "/lighting",
    },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="px-4 sm:px-20 py-8">
      <h2 className="text-2xl font-serif text-center mb-8 text-gray-900">
        Explore Categories
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {displayCategories.map((category, index) => (
          <Link
            key={index}
            to={category.link}
            className="group block"
            aria-label={`Explore ${category.name}`}
          >
            <div className="relative aspect-square overflow-hidden mb-3 rounded-lg shadow-md">
              <img
                src={category.image || category.products?.[0]?.url?.[0] || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
              className="text-sm text-center text-gray-900 group-hover:underline"
            >
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}