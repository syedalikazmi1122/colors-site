import React, { useState } from 'react';
import { ShoppingCartIcon, UserIcon, HeartIcon, SearchIcon, X, Plus, Minus } from 'lucide-react';


const Navbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      // id: 1,
      // name: "Montague Table Lamp",
      // price: 318.75,
      // originalPrice: 425.00,
      // image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1600",
      // quantity: 1
    }
  ]);

  const navItems = [
    'New', 'Wallpaper', 'Rugs', 'Murals', 'Wall Decor',
    'Rugs', 'Kids Wallpapers'
  ];

  const adjustQuantity = (itemId, increment) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const totalDiscount = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200">
        {/* Top Utility Links */}
        <div className="flex justify-end space-x-6 text-sm bg-slate-50 text-gray-600 p-4 pr-4">
          <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }} className="hover:underline font-medium hover:text-gray-900">Rewards</a>
          <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }} className="font-medium hover:underline hover:text-gray-900">Registry</a>
          <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }} className="font-medium hover:underline hover:text-gray-900">Designer Trade</a>
          <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }} className="font-medium hover:underline hover:text-gray-900">Gift Card</a>
          <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }} className="font-medium hover:underline hover:text-gray-900">Track Your Order</a>
          <a href="#" style={{ fontFamily: "Space Grotesk, sans-serif" }} className="font-semibold hover:text-gray-900">STUDIO MCGEE</a>
        </div>
        <div className="flex  justify-between items-center px-4 mx-3 py-6">
          {/* Search Area */}
          <div className="flex items-center border-none rounded-md px-3 py-1 w-96">
            <SearchIcon size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="SEARCH"
              className="w-full outline-none border-none text-sm"
            />
          </div>

          <div className="text-2xl font-bold">MCGEE & CO.</div>

          {/* Right Icons */}
          <div className="flex space-x-6">
            <button className="text-gray-600 hover:text-black">
              <UserIcon size={20} />
            </button>
            <button className="text-gray-600 hover:text-black">
              <HeartIcon size={20} />
            </button>
            <button
              className="text-gray-600 hover:text-black relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCartIcon size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-5 -right-2 bg-gray-900 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
        <hr className="border-gray-200" />
        {/* Main Navbar */}
        <div className="flex justify-center items-center px-4 py-3">
          {/* Navigation Items */}
          <div className="flex space-x-6 overflow-x-auto">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-base text-gray-700 hover:text-black whitespace-nowrap"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <div className={`fixed inset-0 overflow-hidden z-50 ${isCartOpen ? '' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isCartOpen ? 'opacity-50' : 'opacity-0'
            }`}
          onClick={() => setIsCartOpen(false)}
        />

        {/* Cart Panel */}
        <div className={`absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name || "Product Image"}
                    className="w-24 h-24 object-cover rounded-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">{item.name || "Unnamed Product"}</h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ${item.price ? item.price.toFixed(2) : "0.00"}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => adjustQuantity(item.id, false)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity || 1}</span>
                        <button
                          onClick={() => adjustQuantity(item.id, true)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-red-600">-${totalDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-sm text-sm hover:bg-gray-800 transition-colors">
                CHECKOUT
              </button>
              <button className="w-full border border-gray-300 text-gray-900 py-3 px-4 rounded-sm text-sm hover:bg-gray-50 transition-colors">
                VIEW CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;