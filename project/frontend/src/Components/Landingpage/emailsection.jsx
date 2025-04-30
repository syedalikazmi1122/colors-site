import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sendRequest from "../../Utils/apirequest";
import Image1 from "./../../../src/Assets/1.jpg"
import Image2 from "./../../../src/Assets/2.jpg"
import Image3 from "./../../../src/Assets/3.jpg"  
import Image4 from "./../../../src/Assets/4.jpg"
import Image5 from "./../../../src/Assets/19.jpg"
import Image6 from "./../../../src/Assets/15.jpg"
import Image7 from "./../../../src/Assets/18.jpg"

const defaultCategories = [
  {
    name: "Beds & Headboards",
    image: Image1,
    link: "/beds-headboards"
  },
  {
    name: "Dressers & Nightstands",
    image: Image2,
    link: "/dressers-nightstands"
  },
  {
    name: "Bedding",
    image: Image3,
    link: "/bedding"
  },
  {
    name: "Living Room Furniture",
    image: Image4,
    link: "/living-room-furniture"
  },
  {
    name: "Dining Room Furniture",
    image: Image5,
    link: "/dining-room-furniture"
  },
  {
    name: "Office Furniture",
    image: Image6,
    link: "/office-furniture"
  },
  {
    name: "Outdoor Furniture",
    image: Image7,
    link: "/outdoor-furniture"
  }
];

const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await sendRequest('get', '/home', null);
        if (response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching random products:', error);
      }
    };
    fetchRandomProducts();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
  };

  const displayCategories = products.length > 0 ? products : defaultCategories;

  return (
    <div className='bg-gray-100'>
      <div className="bg-gray-100 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-serif mb-12 text-gray-900">Shop By Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayCategories.map((category, index) => (
            <Link 
              key={index}
              to={category.link || `/products/${category.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                <img
                  src={category.image?.endsWith('.svg') ? category.image : category.url?.[0] || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-base text-gray-900 group-hover:text-gray-600 transition-colors duration-200">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailSignup;