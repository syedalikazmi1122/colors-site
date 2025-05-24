"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CartItem from "../components/checkout/CartItem"
import OrderSummary from "../components/checkout/OrderSummary"
import CheckoutSteps from "../components/checkout/CheckoutSteps"
import BillingForm from "../components/checkout/BillingForm"
import PaymentForm from "../components/checkout/PaymentForm"
import { createCheckoutSession } from "../services/stripeService"

// Mock data for cart items if needed
const mockCartItems = [
  {
    id: "1",
    name: "Oriental Garden Wallpaper",
    price: 157,
    image: "https://via.placeholder.com/300x300",
    quantity: 1,
    type: "SMOOTH - Peel and Stick",
    color: "Light Blue",
    width: "16ft",
    height: "9ft",
  },
  {
    id: "2",
    name: "Oriental Garden Wallpaper",
    price: 157,
    image: "https://via.placeholder.com/300x300",
    quantity: 1,
    type: "SMOOTH - Peel and Stick",
    color: "Light Blue",
    width: "16ft",
    height: "9ft",
  },
]

const Cart = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState("cart")
  const [billingData, setBillingData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Use the cart hook or mock data
  // const { items: cartItems, updateQuantity, removeItem, subtotal } = useCart();
  const [cartItems, setCartItems] = useState(mockCartItems)

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const tax = 0 // No tax for this example
  const total = subtotal + shipping + tax

  // Handle quantity updates
  const handleUpdateQuantity = (id, quantity) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Handle item removal
  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Handle coupon application
  const handleApplyCoupon = (couponCode) => {
    // Here you would typically validate the coupon with your backend
    alert(`Coupon ${couponCode} applied!`)
  }

  // Handle checkout button click
  const handleCheckout = () => {
    setStep("billing")
  }

  // Handle billing form submission
  const handleBillingSubmit = (data) => {
    setBillingData(data)
    setStep("payment")
  }

  // Handle payment form submission
  const handlePaymentSubmit = async (data) => {
    setIsLoading(true)

    try {
      // Here you would typically send the order data to your backend
      // and initiate the Stripe payment process
      const result = await createCheckoutSession(cartItems, billingData)

      if (result.success) {
        // If using direct redirect, this might not execute
        navigate("/checkout/success")
      } else {
        throw new Error(result.error || "Payment failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      setIsLoading(false)
      // Optionally show error message to user
    }
  }

  // Handle back button
  const handleBack = () => {
    if (step === "payment") {
      setStep("billing")
    } else if (step === "billing") {
      setStep("cart")
    }
  }

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif">STEP {step === "cart" ? "1" : step === "billing" ? "2" : "4"}</h1>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <CheckoutSteps currentStep={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "cart" && (
              <>
                <h2 className="text-2xl font-serif mb-6">Your Shopping Cart</h2>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <button className="text-gray-700 underline" onClick={handleContinueShopping}>
                      Continue shopping
                    </button>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-none">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        price={item.price}
                        image={item.image}
                        quantity={item.quantity}
                        type={item.type}
                        color={item.color}
                        width={item.width}
                        height={item.height}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {step === "billing" && (
              <>
                <h2 className="text-2xl font-serif mb-6">Checkout Details</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Returning customer?{" "}
                  <a href="#" className="text-gray-700 underline">
                    Click here to login
                  </a>
                </p>
                <BillingForm onSubmit={handleBillingSubmit} onBack={handleBack} />
              </>
            )}

            {step === "payment" && (
              <>
                <h2 className="text-2xl font-serif mb-6">Checkout Details</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Returning customer?{" "}
                  <a href="#" className="text-gray-700 underline">
                    Click here to login
                  </a>
                </p>

                <div className="mb-8">
                  <h3 className="font-medium mb-4">PRODUCT</h3>
                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between">
                      <div>
                        {cartItems.map((item) => (
                          <div key={item.id} className="mb-2">
                            <p>
                              {item.name} - {item.color}, Width: {item.width} - Height: {item.height}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="font-medium">${subtotal}</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between">
                      <span>SUBTOTAL</span>
                      <span>${subtotal}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between">
                      <span>SHIPPING</span>
                      <span>Free shipping: $0</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between">
                      <span>TAX</span>
                      <span>${tax}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between font-medium">
                      <span>TOTAL</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>

                <PaymentForm onSubmit={handlePaymentSubmit} onBack={handleBack} />
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              items={step !== "cart" ? cartItems : undefined}
              showItems={step !== "cart"}
              showCouponInput={step === "cart"}
              showCheckoutButton={step === "cart"}
              onApplyCoupon={handleApplyCoupon}
              onCheckout={handleCheckout}
              onContinueShopping={handleContinueShopping}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
