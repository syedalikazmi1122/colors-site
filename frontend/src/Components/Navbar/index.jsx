"use client";

import { useEffect, useState } from "react";
import { ShoppingCartIcon, UserIcon, HeartIcon, SearchIcon, X, Menu } from "lucide-react";
// Make sure this path is correct for your project structure
import Cart from "./cart";
// Make sure this path is correct
import sendRequest from "../../Utils/apirequest";
// Make sure this path is correct
import useProfileAuthStore from "../../Zustand/profileAuthStore";
import toast, { Toaster } from "react-hot-toast";
// Make sure this path is correct
import Logo from "./../../Assets/fabb_logo.jpg"

const Navbar = () => {
  // ===== FUNCTIONAL STATE (Keep this) =====
  const user = useProfileAuthStore((state) => state.isLoggedIn);
  // State to hold the entire cart object from the API
  const [cartData, setCartData] = useState({ items: [], subtotal: 0, totalDiscount: 0 });
  // State for UI toggles
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // ===== END FUNCTIONAL STATE =====

  // ===== FUNCTIONALITY (Keep this) =====
  // Function to fetch/refresh cart data
  const fetchCartData = async () => {
    if (!user) {
      setCartData({ items: [], subtotal: 0, totalDiscount: 0 });
      return;
    }
    try {
      const response = await sendRequest("get", "/cart", null);
      if (response.data && Array.isArray(response.data.items)) {
        setCartData(response.data);
      } else {
        console.warn("Unexpected cart data structure:", response.data);
        setCartData({ items: [], subtotal: 0, totalDiscount: 0 });
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCartData({ items: [], subtotal: 0, totalDiscount: 0 });
    }
  };

  // Fetch cart data on mount and when user login status changes
  useEffect(() => {
    fetchCartData();
  }, [user]); // Re-fetch when user logs in/out

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) setIsCartOpen(false); // Close cart if opening menu
  };

  const toggleCart = () => {
    if (!user) {
      toast.error("Please login to open the cart!");
      return;
    }
    // Fetch latest data when opening the cart
    if (!isCartOpen) {
        fetchCartData();
    }
    setIsCartOpen(!isCartOpen);
    if (!isCartOpen) setIsMobileMenuOpen(false); // Close menu if opening cart
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    // Add search logic here if needed
    // console.log("Searching for:", mobileSearchQuery);
    setIsMobileMenuOpen(false); // Close menu after search submission
  };
  // ===== END FUNCTIONALITY =====


  // ===== ORIGINAL DESIGN DATA (Keep exactly as you had it) =====
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
  // ===== END ORIGINAL DESIGN DATA =====

  // Calculate cart item count dynamically (Keep this)
  const cartItemCount = cartData.items?.length || 0;

  return (
    <>
      {/* ===== ORIGINAL JSX STRUCTURE (Restore exactly as you had it) ===== */}
      <nav className="w-full bg-white border-b border-gray-200">
        {/* Top Utility Links - Hidden on mobile */}
        <div className="hidden md:flex justify-end space-x-6 text-sm bg-slate-50 text-gray-600 p-4 pr-4">
          {utilityLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              // **Important:** If you had specific font styles, keep them.
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
              className={`hover:underline hover:text-gray-900 ${link.isBold ? "font-semibold" : "font-medium"}`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Main Navbar Row */}
        <div className="flex justify-between items-center px-4 mx-0 md:mx-3 py-4 md:py-6">
          {/* Hamburger Menu - Visible only on mobile */}
          <button className="md:hidden text-gray-600 hover:text-black" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>

          {/* Search Area - Responsive */}
          <div className="hidden md:flex items-center border-none rounded-md px-3 py-1 w-96">
            <SearchIcon size={20} className="text-gray-500 mr-2" />
            {/* Ensure input styling is exactly as you had it */}
            <input type="text" placeholder="SEARCH" className="w-full outline-none border-none text-sm" />
          </div>

          {/* Logo - Centered on mobile */}
          <div className="text-xl md:text-2xl font-bold">
            <a href="/" className="flex items-center space-x-2">
              {/* Ensure Logo path and styling are correct */}
              <img src={Logo} alt="Logo" className="h-12" />
              {/* Add text logo here if you had one */}
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

            {/* Cart icon - Always visible (FUNCTIONAL CHANGE HERE) */}
            <button className="text-gray-600 hover:text-black relative" onClick={toggleCart}>
              <ShoppingCartIcon size={20} />
              {/* Use calculated cartItemCount for the badge */}
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Only visible when active */}
        {isSearchActive && (
          <div className="md:hidden px-4 py-3 border-t border-gray-200">
            {/* Keep your original mobile search form */}
            <form onSubmit={handleMobileSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 p-2 border border-gray-300 rounded-l-sm text-sm"
                // Bind value and onChange if you implement search state
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

        {/* Main Navbar Links - Hidden on mobile */}
        <div className="hidden md:flex justify-center items-center px-4 py-3">
          <div className="flex space-x-6 overflow-x-auto">
            {/* Map over your original navItems */}
            {navItems.map((item) => (
              <a key={item.slug} href={`/${item.slug}`} className="text-base text-gray-700 hover:text-black whitespace-nowrap">
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
      {/* ===== END ORIGINAL JSX STRUCTURE ===== */}


      {/* ===== MOBILE MENU DRAWER (Keep original structure) ===== */}
      <div className={`fixed inset-0 overflow-hidden z-50 ${isMobileMenuOpen ? "" : "pointer-events-none"}`}>
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-50" : "opacity-0"}`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
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
                  {/* Map over your original navItems */}
                  {navItems.map((item) => (
                    <li key={item.slug}>
                      <a href={`/${item.slug}`} className="text-base font-medium text-gray-900 hover:text-gray-600">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Add other mobile menu sections (utility links, etc.) if you had them */}
            </div>
          </div>
        </div>
      </div>
      {/* ===== END MOBILE MENU DRAWER ===== */}


      {/* ===== CART COMPONENT (FUNCTIONAL CHANGE HERE) ===== */}
      {/* Pass the correct props: cartData object and the refetchCart function */}
      <Cart
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartData={cartData}           // Pass the whole data object
        refetchCart={fetchCartData}  // Pass the function to refresh data
      />
      {/* ===== END CART COMPONENT ===== */}

      {/* Toaster for notifications */}
      <Toaster position="bottom-right"/>
    </>
  );
};

export default Navbar;