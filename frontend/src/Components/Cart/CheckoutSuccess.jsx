import { Link } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { useCart } from "../../Context/CartContext"
import Footer from "../Footer"
import Navbar from "../Navbar"

const CheckoutSuccess = () => {
  const { t } = useTranslation()
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart when the success page loads
    clearCart()
  }, [clearCart])

  return (
    <>
    
<Navbar />
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-serif mb-2">{t('cart.orderSuccessful')}</h1>
          <p className="text-gray-600 mb-6">
            {t('cart.orderReceived')}
          </p>

          <p className="text-gray-600 mb-6">
            {t('cart.confirmationEmail')}
          </p>

          <div className="space-y-4">
            <Link
              to="/"
              className="block w-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-md text-center"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
<Footer />
</>



  )
}

export default CheckoutSuccess
