import { Link } from "react-router-dom"
import { XCircle } from "lucide-react"

const CheckoutCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-serif mb-2">Order Cancelled</h1>
          <p className="text-gray-600 mb-6">Your order has been cancelled and no payment has been processed.</p>

          <p className="text-gray-600 mb-6">
            If you encountered any issues during checkout or have any questions, please don't hesitate to contact our
            customer support team.
          </p>

          <div className="space-y-4">
            <Link
              to="/cart"
              className="block w-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-md text-center"
            >
              Return to Cart
            </Link>
            <Link
              to="/"
              className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutCancel
