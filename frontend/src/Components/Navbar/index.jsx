"use client";

import { useEffect, useState } from "react";
import { ShoppingCartIcon, UserIcon, HeartIcon, SearchIcon, X, Menu } from "lucide-react";
import Cart from "./cart";
import sendRequest from "../../Utils/apirequest";
import useProfileAuthStore from "../../Zustand/profileAuthStore";
import toast from "react-hot-toast";
import Logo from "./../../Assets/fabb_logo.jpg"

const Navbar = () => {
  const user = useProfileAuthStore((state) => state.isLoggedIn);
  const [cartItems, setCartItems] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest("get", "/cart", null);
        console.log("Cart Data:", response.data);
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchData();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) setIsCartOpen(false);
  };

  const toggleCart = () => {
    if (!user) {
      toast.error("Please login to open the cart!");
      return;
    }
    setIsCartOpen(!isCartOpen);
    if (!isCartOpen) setIsMobileMenuOpen(false);
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    // console.log("Searching for:", mobileSearchQuery);
    setIsMobileMenuOpen(false);
  };

  const utilityLinks = [
    { name: "Rewards", href: "#" },
    { name: "Registry", href: "#" },
    { name: "Designer Trade", href: "#" },
    { name: "Gift Card", href: "#" },
    { name: "Track Your Order", href: "#" },
    { name: "STUDIO MCGEE", href: "#", isBold: true },
  ];

  const navItems = [
    { name: "New", slug: "category/new" },
    { name: "Wallpaper", slug: "category/wallpaper" },
    { name: "Murals", slug: "category/murals" },
    { name: "Wall Decor", slug: "category/wall-decor" },
    { name: "Rugs", slug: "category/rugs" },
    { name: "Kids Wallpapers", slug: "category/kids-wallpaper" },
  ];

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
          <div className="text-xl md:text-2xl font-bold">
            <a href="/" className="flex items-center space-x-2">
              <img src={Logo} alt="Logo" className="h-12" />
              
            </a>
          </div>

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
            <a href="/profile" className="hidden sm:block text-gray-600 hover:text-black">
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
                // value={mobileSearchQuery}
                // onChange={(e) => setMobileSearchQuery(e.target.value)}
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
              <a key={item.slug} href={`/${item.slug}`} className="text-base text-gray-700 hover:text-black whitespace-nowrap">
                {item.name}
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

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Main Navigation Items */}
              <div className="py-6 px-6 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Shop</h3>
                <ul className="space-y-4">
                  {navItems.map((item) => (
                    <li key={item.slug}>
                      <a href={`/${item.slug}`} className="text-base font-medium text-gray-900 hover:text-gray-600">
                        {item.name}
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
      <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} cartItems={cartItems} />
    </>
  );
};

export default Navbar;