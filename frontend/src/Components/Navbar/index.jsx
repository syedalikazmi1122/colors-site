"use client"

import { useState } from "react"
import { ShoppingCartIcon, UserIcon, HeartIcon, SearchIcon, X, Menu } from "lucide-react"
import Cart from "./cart"

const Navbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Montague Table Lamp",
      price: 318.75,
      originalPrice: 425.0,
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1600",
      quantity: 1,
    },
  ])

  const utilityLinks = [
    { name: "Rewards", href: "#" },
    { name: "Registry", href: "#" },
    { name: "Designer Trade", href: "#" },
    { name: "Gift Card", href: "#" },
    { name: "Track Your Order", href: "#" },
    { name: "STUDIO MCGEE", href: "#", isBold: true },
  ]

  const navItems = ["New", "Wallpaper", "Rugs", "Murals", "Wall Decor", "Rugs", "Kids Wallpapers"]

  const adjustQuantity = (itemId, increment) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
          : item,
      ),
    )
  }

  const removeItem = (itemId) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId))
  }

  const totalDiscount = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Close cart if mobile menu is opening
    if (!isMobileMenuOpen) setIsCartOpen(false)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
    // Close mobile menu if cart is opening
    if (!isCartOpen) setIsMobileMenuOpen(false)
  }

  // Handle mobile search
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const handleMobileSearch = (e) => {
    e.preventDefault()
    // Implement search functionality here
    console.log("Searching for:", mobileSearchQuery)
    // Close mobile menu after search
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200">
        {/* Top Utility Links - Hidden on mobile */}
        <div className="hidden md:flex justify-end space-x-6 text-sm bg-slate-50 text-gray-600 p-4 pr-4">
          {utilityLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
              className={`hover:underline hover:text-gray-900 ${link.isBold ? "font-semibold" : "font-medium"}`}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex justify-between items-center px-4 mx-0 md:mx-3 py-4 md:py-6">
          {/* Hamburger Menu - Visible only on mobile */}
          <button className="md:hidden text-gray-600 hover:text-black" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>

          {/* Search Area - Responsive */}
          <div className="hidden md:flex items-center border-none rounded-md px-3 py-1 w-96">
            <SearchIcon size={20} className="text-gray-500 mr-2" />
            <input type="text" placeholder="SEARCH" className="w-full outline-none border-none text-sm" />
          </div>

          {/* Logo - Centered on mobile */}
          <div className="text-xl md:text-2xl font-bold">MCGEE & CO.</div>

          {/* Right Icons - Responsive */}
          <div className="flex space-x-4 md:space-x-6">
            {/* Search icon only on mobile */}
            <button
              className="md:hidden text-gray-600 hover:text-black"
              onClick={() => setIsSearchActive(!isSearchActive)}
            >
              <SearchIcon size={20} />
            </button>

            {/* User icon - Hidden on smallest screens */}
            <a href="/account" className="hidden sm:block text-gray-600 hover:text-black">
              <UserIcon size={20} />
            </a>

            {/* Heart icon - Hidden on smallest screens */}
            <a href="/wishlist" className="hidden sm:block text-gray-600 hover:text-black">
              <HeartIcon size={20} />
            </a>

            {/* Cart icon - Always visible */}
            <button className="text-gray-600 hover:text-black relative" onClick={toggleCart}>
              <ShoppingCartIcon size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Only visible when active */}
        {isSearchActive && (
          <div className="md:hidden px-4 py-3 border-t border-gray-200">
            <form onSubmit={handleMobileSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 p-2 border border-gray-300 rounded-l-sm text-sm"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-gray-900 text-white p-2 rounded-r-sm">
                <SearchIcon size={18} />
              </button>
            </form>
          </div>
        )}

        <hr className="border-gray-200" />

        {/* Main Navbar - Hidden on mobile */}
        <div className="hidden md:flex justify-center items-center px-4 py-3">
          <div className="flex space-x-6 overflow-x-auto">
            {navItems.map((item) => (
              <a key={item} href="#" className="text-base text-gray-700 hover:text-black whitespace-nowrap">
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 overflow-hidden z-50 ${isMobileMenuOpen ? "" : "pointer-events-none"}`}>
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-50" : "opacity-0"}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search in mobile menu - Moved to top */}
            <div className="border-b border-gray-200 p-4">
              <form onSubmit={handleMobileSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-sm text-sm"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                />
                <button type="submit" className="bg-gray-900 text-white p-2 rounded-r-sm">
                  <SearchIcon size={18} />
                </button>
              </form>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Main Navigation Items */}
              <div className="py-6 px-6 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Shop</h3>
                <ul className="space-y-4">
                  {navItems.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-600">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Account Links */}
              <div className="py-6 px-6 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Account</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="/profile" className="text-base font-medium text-gray-900 hover:text-gray-600">
                      Profile
                    </a>
                  </li>
                  <li>
                    <a href="/wishlist" className="text-base font-medium text-gray-900 hover:text-gray-600">
                      Wishlist
                    </a>
                  </li>
                </ul>
              </div>

              {/* Utility Links */}
              <div className="py-6 px-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Help & Info</h3>
                <ul className="space-y-4">
                  {utilityLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className={`text-base ${link.isBold ? "font-semibold" : "font-medium"} text-gray-900 hover:text-gray-600`}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Component */}
      <Cart
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        adjustQuantity={adjustQuantity}
        removeItem={removeItem}
        subtotal={subtotal}
        totalDiscount={totalDiscount}
      />
    </>
  )
}

export default Navbar

