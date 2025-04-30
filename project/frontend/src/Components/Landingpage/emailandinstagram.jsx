"use client";

import { useState } from "react";
import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const InstagramShop = ({ instagramPosts }) => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
  };

  // If no Instagram posts are available, show default images
  const defaultImages = [
    "/10.jpg",
    "/12.jpg",
    "/13.jpg",
    "/14.jpg",
    "/15.jpg",
    "/16.jpg"
  ];

  const posts = instagramPosts.length > 0 ? instagramPosts : defaultImages.map(url => ({ url: [url] }));

  return (
    <div className="bg-white py-10 md:py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {/* Instagram Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-lg sm:text-xl md:text-xl text-gray-800 font-serif">
            Follow Along
          </h2>
          <p className="mt-2 md:mt-4 text-sm md:text-base text-gray-600 font-serif">
            @lovessdesign
          </p>
        </div>

        {/* Instagram Images Grid - responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {posts.map((post, index) => (
            <Link
              key={index}
              to={post.slug ? `/products/${post.slug}` : '#'}
              className="relative overflow-hidden group cursor-pointer h-64"
            >
              {/* Image */}
              <img
                src={post.url[0] || "/placeholder.svg"}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay with Instagram Logo */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <Instagram className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstagramShop;

