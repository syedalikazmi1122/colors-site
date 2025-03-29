"use client"

import { useState } from "react"

const InstagramShop = () => {
  const [email, setEmail] = useState("")

  const instagramImages = [
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrZo3IKm7gQ2YlEN5MSFmWIKfVEYZlKBVfCg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj3tWKGdbvtLSnSPEwE3cj4DypLjBBz3gtCg&s",
    "https://www.marthastewart.com/thmb/XeQPTA5L3FJar2Kse2Me03dsXxk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/BethanyAdamsInteriors_ModernTudor_LouisvilleKY73-e4c6f2d0efe64d85b5d00fa72be491ed.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPN7Uq5rCfO0dJ-K7zVgGzoguXldl5YaaWyQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TE9rE0gfkZOCRhgQQrMbNcwxzXoKyEdZ0g&s",
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    console.log("Subscribed with email:", email)
  }

  return (
    <div className="bg-white py-10 md:py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {/* Instagram Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-lg sm:text-xl md:text-xl  text-gray-800 font-serif">Follow Along</h2>
         
          <p className="mt-2 md:mt-4 text-sm md:text-base text-gray-600 font-serif">
             @lovessdesign
          </p>
        </div>

        {/* Instagram Images Grid - responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-8 mb-10 md:mb-16">
          {instagramImages.map((image, index) => (
            <div key={index} className="aspect-square overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

      
      </div>
    </div>
  )
}

export default InstagramShop

