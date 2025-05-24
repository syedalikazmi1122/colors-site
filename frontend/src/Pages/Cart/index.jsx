"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CartItem from "./../../Components/Checkout/CartItem"
import OrderSummary from "./../../Components/Checkout/OrderSummary"
import CheckoutSteps from "./../../Components/Checkout/CheckoutSteps"
import BillingForm from "./../../Components/Checkout/BillingForm"
import PaymentForm from "./../../Components/Checkout/PaymentForm"
import { createCheckoutSession } from "./../../Services/stripeService"
import sendRequest from "../../Utils/apirequest"
import useProfileAuthStore from "./../../Zustand/profileAuthStore"
import { useTranslation } from "react-i18next"
import { useCurrency } from "../../Context/CurrencyContext"
import { toast } from "react-hot-toast"
import Footer from "../../Components/Footer"
import Navbar from "../../Components/Navbar"

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
  const { t, i18n } = useTranslation()
  const { convertPrice, getCurrencySymbol } = useCurrency()
  const currentLanguage = i18n.language
  const user = useProfileAuthStore((state) => state.isLoggedIn)
  const navigate = useNavigate()
  const [step, setStep] = useState("cart")
  const [billingData, setBillingData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cartItems, setCartItems] = useState([])

  // Use the cart hook or mock data
  // const { items: cartItems, updateQuantity, removeItem, subtotal } = useCart();
  const fetchCartData = async () => {
    if (!user) {
      setCartItems([])
      return
    }
    try {
      const response = await sendRequest("get", "/cart", null)
      if (response.data && Array.isArray(response.data.items)) {
        setCartItems(response.data.items)
      } else {
        console.warn("Unexpected cart data structure:", response.data)
        setCartItems([])
      }
    } catch (error) {
      console.error("Error fetching cart data:", error)
      setCartItems([])
    }
  }

  useEffect(() => {
    fetchCartData()
  }, [user])

  // Calculate totals with currency conversion
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const itemPrice = item.productId?.price || 0
      const convertedPrice = convertPrice(itemPrice)
      return sum + (convertedPrice * item.quantity)
    }, 0)
    
    const shipping = 0 // Free shipping
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + shipping + tax

    return {
      subtotal,
      shipping,
      tax,
      total
    }
  }

  const totals = calculateTotals()

  // Handle quantity updates
  const handleUpdateQuantity = async (id, quantity) => {
    try {
      const response = await sendRequest("put", `/cart/${id}`, { quantity })
      if (response.status === 200) {
        fetchCartData()
        toast.success(t('cart.quantityUpdated'))
      }
    } catch (error) {
      toast.error(t('cart.updateError'))
    }
  }

  // Handle item removal
  const handleRemoveItem = async (id) => {
    try {
      const response = await sendRequest("delete", `/cart/${id}`)
      if (response.status === 200) {
        fetchCartData()
        toast.success(t('cart.itemRemoved'))
      }
    } catch (error) {
      toast.error(t('cart.removeError'))
    }
  }

  // Handle coupon application
  const handleApplyCoupon = (couponCode) => {
    toast(t('cart.couponApplied', { code: couponCode }))
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

  // Handle payment form submission with currency conversion
  const handlePaymentSubmit = async (data) => {
    setIsLoading(true)
    try {
      const convertedItems = cartItems.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productId.title?.en,
            description: item.productId.materialDescription?.en,
            images: item.productId.url,
            metadata: {
              productId: item.productId._id,
              category: item.productId.category,
              material: item.productId.material?.map(m => m[currentLanguage] || m.en).join(', ')
            }
          },
          unit_amount: Math.round(convertPrice(item.productId.price) * 100) // Convert to cents
        },
        quantity: item.quantity
      }))
      
      const result = await createCheckoutSession(convertedItems, billingData)
      if (result.success) {
        navigate("/checkout/success")
      } else {
        throw new Error(result.error || t('cart.paymentFailed'))
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error(t('cart.paymentError'))
      setIsLoading(false)
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
<>
<Navbar />
<div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif">{t('cart.title')}</h1>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <CheckoutSteps currentStep={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "cart" && (
              <>
                <h2 className="text-2xl font-serif mb-6">{t('cart.productDetails')}</h2>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
                    <button 
                      className="text-gray-700 underline" 
                      onClick={handleContinueShopping}
                    >
                      {t('cart.continueShopping')}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-none">
                    {cartItems.map((item) => (
                      <div key={item._id} className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={item.productId.url[0]} 
                            alt={item.productId.title?.[currentLanguage] || item.productId.title?.en}
                            className="w-24 h-24 object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">
                              {item.productId.title?.[currentLanguage] || item.productId.title?.en}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.productId.materialDescription?.[currentLanguage] || item.productId.materialDescription?.en}
                            </p>
                            <div className="mt-2">
                              <p className="text-sm">
                                {t('cart.quantity')}: {item.quantity}
                              </p>
                              <p className="text-sm font-medium">
                                {t('cart.price')}: {getCurrencySymbol()}{convertPrice(item.productId.price)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-lg font-medium">
                              {getCurrencySymbol()}{convertPrice(item.productId.price * item.quantity)}
                            </p>
                            <div className="mt-2 space-x-2">
                              <button
                                onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                className="text-gray-500 hover:text-gray-700"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                +
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="text-red-500 hover:text-red-700 ml-4"
                              >
                                {t('cart.remove')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {step === "billing" && (
              <>
                <h2 className="text-2xl font-serif mb-6">{t('cart.billingDetails')}</h2>
                <p className="text-sm text-gray-500 mb-6">
                  {t('cart.returningCustomer')}{" "}
                  <a href="#" className="text-gray-700 underline">
                    {t('cart.clickToLogin')}
                  </a>
                </p>
                <BillingForm onSubmit={handleBillingSubmit} onBack={handleBack} />
              </>
            )}

            {step === "payment" && (
              <>
                <h2 className="text-2xl font-serif mb-6">{t('cart.paymentDetails')}</h2>
                <div className="mb-8">
                  <h3 className="font-medium mb-4">{t('cart.product')}</h3>
                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between">
                      <div>
                        {cartItems.map((item) => (
                          <div key={item._id} className="mb-2">
                            <p>
                              {item.productId.title?.[currentLanguage] || item.productId.title?.en} - 
                              {item.productId.material?.map(m => m[currentLanguage] || m.en).join(', ')}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="font-medium">{getCurrencySymbol()}{convertPrice(totals.subtotal)}</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between">
                      <span>{t('cart.subtotal')}</span>
                      <span>{getCurrencySymbol()}{convertPrice(totals.subtotal)}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between">
                      <span>{t('cart.shipping')}</span>
                      <span>{t('cart.freeShipping')}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between">
                      <span>{t('cart.tax')}</span>
                      <span>{getCurrencySymbol()}{convertPrice(totals.tax)}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between font-medium">
                      <span>{t('cart.total')}</span>
                      <span>{getCurrencySymbol()}{convertPrice(totals.total)}</span>
                    </div>
                  </div>
                </div>

                <PaymentForm 
                  onSubmit={handlePaymentSubmit} 
                  onBack={handleBack}
                  isLoading={isLoading}
                  totals={totals}
                  currencySymbol={getCurrencySymbol()}
                />
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              items={cartItems}
              subtotal={totals.subtotal}
              shipping={totals.shipping}
              tax={totals.tax}
              total={totals.total}
              onApplyCoupon={handleApplyCoupon}
              onCheckout={handleCheckout}
              step={step}
            />
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}

export default Cart
