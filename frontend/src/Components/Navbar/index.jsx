import { useState, useEffect } from "react";
import { ShoppingCartIcon, UserIcon, SearchIcon, Menu, X } from "lucide-react";
import Cart from "./cart";
import sendRequest from "../../Utils/apirequest";
import { useCurrency } from "../../Context/CurrencyContext";
import useProfileAuthStore from "../../Zustand/profileAuthStore";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";

const Navbar = () => {
  const { t } = useTranslation();
  const { currency, setCurrency, getCurrencySymbol } = useCurrency();
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD'];
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // ===== FUNCTIONAL STATE =====
  const user = useProfileAuthStore((state) => state.isLoggedIn);
  const [cartData, setCartData] = useState({ items: [], subtotal: 0, totalDiscount: 0 });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // ===== END FUNCTIONAL STATE =====

  // ===== FUNCTIONALITY =====
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchActive(false);
      setSearchQuery("");
    }
  };

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

  useEffect(() => {
    fetchCartData();
  }, [user]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsCartOpen(false);
      setIsSearchActive(false);
    }
  };

  const toggleMobileSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleCart = () => {
    if (!user) {
      toast.error("Please login to open the cart!");
      return;
    }
    if (!isCartOpen) {
      fetchCartData();
    }
    setIsCartOpen(!isCartOpen);
    if (!isCartOpen) {
      setIsMobileMenuOpen(false);
      setIsSearchActive(false);
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setIsSearchActive(false);
      setSearchQuery("");
    }
  };
  // ===== END FUNCTIONALITY =====

  // ===== DESIGN DATA =====
  const utilityLinks = [
    { name: "Rewards", href: "#" },
    { name: "Registry", href: "#" },
    { name: "Designer Trade", href: "#" },
    { name: "Gift Card", href: "#" },
    { name: "Track Your Order", href: "#" },
    { name: "STUDIO MCGEE", href: "#", isBold: true },
  ];

  const navItems = [
    { name: "Wallpaper", slug: "category/wallpaper" },
    { name: "Murals", slug: "category/murals" },
    { name: "Wall Decor", slug: "category/wall-decor" },
    { name: "Rugs", slug: "category/rugs" },
    { name: "Kids Wallpapers", slug: "category/kids-wallpaper" },
  ];
  // ===== END DESIGN DATA =====

  const cartItemCount = cartData.items?.length || 0;

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200">
        {/* Top Utility Links - Hidden on small screens */}
        <div className="hidden md:flex justify-end space-x-4 sm:space-x-6 text-xs sm:text-sm bg-slate-50 text-gray-600 p-2 sm:p-3 md:p-4 pr-4">
          {/* Utility Links */}
          <div className="flex flex-wrap justify-end gap-3 sm:gap-4 md:gap-6">
            {utilityLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`hover:underline hover:text-gray-900 ${link.isBold ? "font-bold" : "font-normal"}`}
              >
                {link.name}
              </a>
            ))}
          </div>
          {/* Language and Currency Selectors */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-sm text-gray-600 bg-transparent border-none focus:outline-none"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr} ({getCurrencySymbol(curr)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Mobile menu button - Only visible on small screens */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded={isMobileMenuOpen}
                aria-label="Main menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Desktop Search - Hidden on mobile */}
            <div className="hidden md:flex md:items-center md:w-1/4">
              <form onSubmit={handleSearch} className="relative w-full flex items-center">
                <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3" />
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-1 border-0 focus:ring-0 focus:outline-none text-sm"
                />
              </form>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex justify-center">
              <a href="/" className="text-xl sm:text-2xl font-serif tracking-wide text-gray-800">
                {t('nav.home')}
              </a>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search Toggle - Only visible on small screens */}
              <button
                onClick={toggleMobileSearch}
                className="md:hidden p-2 text-gray-600 hover:text-gray-800"
                aria-label="Search"
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              {/* User Profile */}
              <a
                href={user ? "/profile" : "/login"}
                className="p-1 sm:p-2 text-gray-600 hover:text-gray-800"
                aria-label={user ? "Profile" : "Login"}
              >
                <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>

              {/* Wishlist - Hidden on small screens */}
              <a
                href="/wishlist"
                className="p-1 sm:p-2 text-gray-600 hover:text-gray-800 hidden md:block"
                aria-label="Wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </a>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="p-1 sm:p-2 text-gray-600 hover:text-gray-800 relative"
                aria-label="Cart"
              >
                <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation - Desktop Only */}
        <div className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center space-x-4 lg:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={`/${item.slug}`}
                  className="text-gray-600 hover:text-gray-900 px-2 lg:px-3 py-3 lg:py-4 text-sm font-normal whitespace-nowrap"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Only visible when active */}
        {isSearchActive && (
          <div className="md:hidden px-4 py-3 border-t border-gray-200">
            <form onSubmit={handleMobileSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="flex-1 p-2 border border-gray-300 rounded-l-sm text-sm"
              />
              <button type="submit" className="bg-gray-900 text-white p-2 rounded-r-sm">
                <SearchIcon size={18} />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
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
              <h2 className="text-lg font-medium">{t('nav.menu')}</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Main Navigation Items */}
              <div className="py-6 px-6 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('nav.shop')}</h3>
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
              
              {/* Mobile Utility Links - Only shown in mobile menu */}
              <div className="py-6 px-6 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('nav.account')}</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="/wishlist" className="text-base font-medium text-gray-900 hover:text-gray-600">
                      {t('common.wishlist')}
                    </a>
                  </li>
                  <li>
                    <a href={user ? "/profile" : "/login"} className="text-base font-medium text-gray-900 hover:text-gray-600">
                      {user ? t('common.profile') : t('common.login')}
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Mobile Utility Links */}
              <div className="py-6 px-6 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('nav.customerService')}</h3>
                <ul className="space-y-4">
                  {utilityLinks.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href} 
                        className={`text-base hover:text-gray-600 ${link.isBold ? "font-medium text-gray-900" : "text-gray-700"}`}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Mobile Search */}
              <div className="py-6 px-6 border-b border-gray-200">
                <form onSubmit={handleMobileSearch}>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('search.placeholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <SearchIcon className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Currency Selector in Mobile Menu */}
              <div className="py-6 px-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('nav.currency')}</h3>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} ({getCurrencySymbol(curr)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Component */}
      <Cart 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen}
        cartData={cartData}
        refetchCart={fetchCartData}
      />

      {/* Toaster for notifications */}
      <Toaster position="bottom-right" />
    </>
  );
};

export default Navbar;