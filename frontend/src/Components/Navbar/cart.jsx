"use client"
import { X, Plus, Minus } from "lucide-react"
import toast from "react-hot-toast"
import sendRequest from "../../Utils/apirequest"

const Cart = ({ isCartOpen, setIsCartOpen, cartItems, subtotal, totalDiscount }) => {
  console.log("Cart Items:ss", cartItems.items)
  const increaseQuantity = (id, isAdd) => {
     const response = sendRequest("put", "/cart/" + id, { isAdd: isAdd });
    console.log("response", response);
    if (response.status === 200) {
      console.log("Item quantity updated:", id);
      toast.success("Item quantity updated");
    } else {
      console.error("Error updating item quantity:", response.statusText);
      toast.error("Error updating item quantity");
    }
  }
  const decreaseQuantity = (id, isAdd) => {
     const response = sendRequest("put", "/cart/" + id, { isAdd: isAdd });
    console.log("response", response);
    if (response.status === 200) {
      console.log("Item quantity updated:", id);
      toast.success("Item quantity updated");
    } else {
      console.error("Error updating item quantity:", response.statusText);
      toast.error("Error updating item quantity");
    }
  }
  const removeItem =async (id) => {
const response = await sendRequest("delete", "/cart/" + id, {});
console.log("response", response);
if (response.status === 200) {
  console.log("Item removed from cart:", id);
   toast.success("Item removed from cart");
   cartItems.items = cartItems.items.filter(item => item.productId._id !== id);
  
}
else {
  console.error("Error removing item from cart:", response.statusText);
  toast.error("Error removing item from cart");
}
  }




  return (
    <div className={`fixed inset-0 overflow-hidden z-50 ${isCartOpen ? "" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isCartOpen ? "opacity-50" : "opacity-0"}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Panel */}
      <div
        className={`absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium">Your Cart </h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
            {cartItems.items?.length > 0 ? (
              cartItems.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <img
                    src={item.productId.url || "/placeholder.svg"}
                    alt={item.productId.title || "Product Image"}
                    className="w-24 h-24 object-cover rounded-sm"
                  />
                  <div className="flex-1 min-w-0">
                    {console.log("item", item)}
                    <h3 className="text-sm font-medium text-gray-900">{item.productId.title || "Unnamed Product"}</h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ${item.productId.price ? item.productId.price.toFixed(2) : "0.00"}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => decreaseQuantity(item.productId._id, false)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity || 1}</span>
                        <button onClick={() => increaseQuantity(item.productId._id, true)} className="p-1 hover:bg-gray-100 rounded">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.productId._id)} className="text-sm text-gray-500 hover:text-gray-700">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="border-t border-gray-200 px-6 py-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                {/* <span className="text-gray-900">${subtotal.toFixed(2)}</span> */}
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  {/* <span className="text-gray-500">Discount</span> */}
                  {/* <span className="text-red-600">-${totalDiscount.toFixed(2)}</span> */}
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
  )
}

export default Cart

