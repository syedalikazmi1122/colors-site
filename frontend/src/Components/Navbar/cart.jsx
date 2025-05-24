// src/Components/Navbar/cart.jsx (or wherever your Cart component is)
"use client"
import { X, Plus, Minus } from "lucide-react"
import toast from "react-hot-toast"
import sendRequest from "../../Utils/apirequest" // Adjust path if needed
import { ShoppingCartIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useCurrency } from "../../Context/CurrencyContext"
// Accept cartData object and refetchCart function as props
const Cart = ({ isCartOpen, setIsCartOpen, cartData, refetchCart }) => {
  const { t, i18n } = useTranslation()
  const { convertPrice, getCurrencySymbol } = useCurrency()
  const currentLanguage = i18n.language

  // Use cartData.items for mapping, and other properties for summary
  const cartItems = cartData?.items || [];
  const subtotal = cartData?.subtotal || 0;
  const totalDiscount = cartData?.totalDiscount || 0;

  console.log("Cart Items received:", cartItems);

  const updateQuantity = async (productId, isAdd) => {
    try {
      // Pass the correct product ID (_id)
      const response = await sendRequest("put", `/cart/${productId}`, { isAdd: isAdd });
      console.log("Update Quantity Response:", response);

      if (response.status === 200) {
        console.log("Item quantity updated:", productId);
        toast.success(t('cart.quantityUpdated'));
        // **Crucial: Call refetchCart to update Navbar's state**
        if (refetchCart) {
          refetchCart();
        }
      } else {
        // Throw error to be caught below
        throw new Error(response.data?.message || t('cart.updateError'));
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast.error(error.message || t('cart.updateError'));
    }
  };

  const removeItem = async (productId) => {
    try {
      // Pass the correct product ID (_id)
      const response = await sendRequest("delete", `/cart/${productId}`, {});
      console.log("Remove Item Response:", response);

      if (response.status === 200) {
        console.log("Item removed from cart:", productId);
        toast.success(t('cart.itemRemoved'));
        // **Crucial: Call refetchCart to update Navbar's state**
        // No need for local filtering anymore: cartItems.items = cartItems.items.filter(...)
        if (refetchCart) {
          refetchCart();
        }
      } else {
         // Throw error to be caught below
         throw new Error(response.data?.message || t('cart.removeError'));
      }
    } catch (error) {
        console.error("Error removing item from cart:", error);
        toast.error(error.message || t('cart.removeError'));
    }
  };

  return (
    <div className={`fixed inset-0 overflow-hidden z-[100] ${isCartOpen ? "" : "pointer-events-none"}`}> {/* Ensure high z-index */}
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isCartOpen ? "opacity-50" : "opacity-0"}`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Cart Panel */}
      <div
        className={`absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 id="cart-heading" className="text-lg font-medium text-gray-900">{t('cart.yourCart')}</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              aria-label={t('cart.closeCart')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 space-y-6">
            {cartItems?.length > 0 ? (
              cartItems.map((item) => (
                // Ensure item and item.productId exist before accessing properties
                item && item.productId ? (
                  <div key={item._id} className="flex items-start space-x-4"> {/* Use item._id if available, fallback */}
                    <img
                      // Use first URL from productId.url array
                      src={item.productId.url?.[0] || "/placeholder.svg"}
                      alt={item.productId.title?.[currentLanguage] || item.productId.title?.en || t('cart.productImage')}
                      className="w-20 h-20 object-cover rounded-sm border border-gray-200 flex-shrink-0" // Fixed size, added border
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.productId.title?.[currentLanguage] || item.productId.title?.en || t('cart.unnamedProduct')}
                      </h3>
                       {/* Optional: Display category or other details if available */}
                       {item.productId.material && item.productId.material.length > 0 && (
                         <p className="text-xs text-gray-500">
                           {item.productId.material.map(m => m[currentLanguage] || m.en).join(', ')}
                         </p>
                       )}

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium text-gray-900">
                          {getCurrencySymbol()}{convertPrice(item.productId.price)}
                        </span>
                         {/* Optional: Display original price if discounted */}
                         {/* {item.originalPrice && item.originalPrice > item.productId.price && (
                           <span className="text-xs text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                         )} */}
                      </div>

                      {/* Quantity Controls and Remove Button */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() => updateQuantity(item.productId._id, false)} // Decrease
                            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-l disabled:opacity-50"
                            disabled={item.quantity <= 1} // Disable if quantity is 1
                            aria-label={t('cart.decreaseQuantity')}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm w-8 text-center px-1 font-medium">{item.quantity}</span>
                          <button
                             onClick={() => updateQuantity(item.productId._id, true)} // Increase
                            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-r"
                            aria-label={t('cart.increaseQuantity')}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId._id)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                          aria-label={t('cart.removeItem')}
                        >
                          {t('cart.remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null // Render nothing if item or productId is missing (data issue)
              ))
            ) : (
              <div className="text-center py-16">
                <ShoppingCartIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">{t('cart.empty')}</p>
                <button
                    onClick={() => setIsCartOpen(false)} // Close cart to allow shopping
                    className="mt-4 text-sm text-rose-600 font-medium hover:underline"
                >
                    {t('cart.continueShopping')}
                </button>
              </div>
            )}
          </div>

          {/* Summary - Only show if items exist */}
          {cartItems?.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-6 space-y-4 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-gray-900">
                  <span>{t('cart.subtotal')}</span>
                  <span>{getCurrencySymbol()}{convertPrice(subtotal)}</span>
                </div>
                 {/* You can add discount display here if needed using totalDiscount */}
                 {/* {totalDiscount > 0 && ( ... )} */}
                <p className="text-xs text-gray-500">{t('cart.shippingTaxNote')}</p>
              </div>
              {/* Make buttons lead somewhere */}
              <a href="/checkout" /* Or use React Router Link */
                 className="block w-full bg-gray-900 text-white py-3 px-4 rounded-sm text-sm font-medium text-center hover:bg-gray-800 transition-colors"
              >
                {t('cart.checkout')}
              </a>
               <a href="/cart" /* Or use React Router Link */
                 className="block w-full border border-gray-300 text-gray-900 py-3 px-4 rounded-sm text-sm font-medium text-center hover:bg-gray-50 transition-colors"
               >
                {t('cart.viewFullCart')}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart;