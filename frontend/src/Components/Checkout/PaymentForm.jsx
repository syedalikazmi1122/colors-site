"use client"

import { useState } from "react"

const PaymentForm = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    agreeToTerms: false,
    confirmCalculations: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Pay by</h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 border border-gray-200 p-3 rounded-md">
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === "card"}
              onChange={handleChange}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
            />
            <label htmlFor="card" className="flex items-center gap-2">
              <div className="flex gap-1">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                    fill="white"
                  />
                  <path d="M9.5 5.5H14.5V10.5H9.5V5.5Z" fill="#2566AF" />
                  <path d="M10 12H7L8 8H11L10 12Z" fill="#EB001B" />
                  <path d="M17 12H14L13 8H16L17 12Z" fill="#00A2E5" />
                </svg>
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                    fill="white"
                  />
                  <path
                    d="M15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z"
                    fill="#EB001B"
                  />
                  <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5" fill="#F79E1B" />
                </svg>
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                    fill="white"
                  />
                  <path d="M14 8H10V6H14V8Z" fill="#006FCF" />
                  <path d="M14 10H10V8H14V10Z" fill="#006FCF" />
                  <path d="M17 6H15V10H17V6Z" fill="#006FCF" />
                  <path d="M9 6H7V10H9V6Z" fill="#006FCF" />
                </svg>
              </div>
              Credit Card
            </label>
          </div>

          {formData.paymentMethod === "card" && (
            <div className="pl-6 space-y-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="sr-only">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="Card number"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cardExpiry" className="sr-only">
                        Expiry Date
                      </label>
                      <input
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM / YY"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="cardCvc" className="sr-only">
                        CVC
                      </label>
                      <input
                        id="cardCvc"
                        name="cardCvc"
                        placeholder="CVC"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 border border-gray-200 p-3 rounded-md">
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="paypal"
              checked={formData.paymentMethod === "paypal"}
              onChange={handleChange}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
            />
            <label htmlFor="paypal" className="flex items-center gap-2">
              <svg width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.5 17.5C16.6421 17.5 20 14.1421 20 10C20 5.85786 16.6421 2.5 12.5 2.5C8.35786 2.5 5 5.85786 5 10C5 14.1421 8.35786 17.5 12.5 17.5Z"
                  fill="#003087"
                />
                <path
                  d="M15 7.5H12.5C11.3954 7.5 10.5 8.39543 10.5 9.5C10.5 10.6046 11.3954 11.5 12.5 11.5H15C16.1046 11.5 17 10.6046 17 9.5C17 8.39543 16.1046 7.5 15 7.5Z"
                  fill="#0070E0"
                />
                <path
                  d="M7.5 7.5H10C11.1046 7.5 12 8.39543 12 9.5C12 10.6046 11.1046 11.5 10 11.5H7.5C6.39543 11.5 5.5 10.6046 5.5 9.5C5.5 8.39543 6.39543 7.5 7.5 7.5Z"
                  fill="#001C64"
                />
              </svg>
              PayPal
            </label>
          </div>

          <div className="flex items-center space-x-2 border border-gray-200 p-3 rounded-md">
            <input
              type="radio"
              id="afterpay"
              name="paymentMethod"
              value="afterpay"
              checked={formData.paymentMethod === "afterpay"}
              onChange={handleChange}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
            />
            <label htmlFor="afterpay" className="flex items-center gap-2">
              <svg width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="20" rx="10" fill="#B2DDC8" />
                <path
                  d="M13.252 14.689V5.312H17.898C20.368 5.312 21.604 6.548 21.604 9.018C21.604 11.488 20.368 12.724 17.898 12.724H15.722V14.689H13.252ZM15.722 10.254H17.898C18.516 10.254 19.134 9.636 19.134 9.018C19.134 8.4 18.516 7.782 17.898 7.782H15.722V10.254Z"
                  fill="#3C4858"
                />
                <path d="M22.2236 14.689V5.312H24.6936V14.689H22.2236Z" fill="#3C4858" />
                <path
                  d="M30.5675 15C27.4795 15 25.9255 13.446 25.9255 10.358C25.9255 7.27 27.4795 5.716 30.5675 5.716C33.6555 5.716 35.2095 7.27 35.2095 10.358C35.2095 13.446 33.6555 15 30.5675 15ZM30.5675 12.53C31.8035 12.53 32.7395 11.594 32.7395 10.358C32.7395 9.122 31.8035 8.186 30.5675 8.186C29.3315 8.186 28.3955 9.122 28.3955 10.358C28.3955 11.594 29.3315 12.53 30.5675 12.53Z"
                  fill="#3C4858"
                />
                <path d="M36.2414 14.689V5.312H38.7114V12.219H43.3574V14.689H36.2414Z" fill="#3C4858" />
                <path
                  d="M49.6313 15C46.5433 15 44.9893 13.446 44.9893 10.358C44.9893 7.27 46.5433 5.716 49.6313 5.716C52.7193 5.716 54.2733 7.27 54.2733 10.358C54.2733 13.446 52.7193 15 49.6313 15ZM49.6313 12.53C50.8673 12.53 51.8033 11.594 51.8033 10.358C51.8033 9.122 50.8673 8.186 49.6313 8.186C48.3953 8.186 47.4593 9.122 47.4593 10.358C47.4593 11.594 48.3953 12.53 49.6313 12.53Z"
                  fill="#3C4858"
                />
                <path
                  d="M55.3052 14.689V5.312H57.7752V10.358L61.4852 5.312H63.9552L60.2452 10.358L63.9552 14.689H61.4852L57.7752 10.358V14.689H55.3052Z"
                  fill="#3C4858"
                />
              </svg>
              Afterpay
            </label>
          </div>

          <div className="flex items-center space-x-2 border border-gray-200 p-3 rounded-md">
            <input
              type="radio"
              id="klarna"
              name="paymentMethod"
              value="klarna"
              checked={formData.paymentMethod === "klarna"}
              onChange={handleChange}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
            />
            <label htmlFor="klarna" className="flex items-center gap-2">
              <svg width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="20" rx="10" fill="#FFB3C7" />
                <path
                  d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                  fill="#3C4858"
                />
              </svg>
              Klarna
            </label>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
        <p className="text-sm text-gray-700">
          Have you calculated the right amount? Do not fall short as ordering more wallpaper at a later date may result
          in color matching issues. Need help or want us to double check your math? Get in touch with Customer Support
          via chat or email.
        </p>
        <div className="flex items-start space-x-2 mt-4">
          <input
            type="checkbox"
            id="confirmCalculations"
            name="confirmCalculations"
            checked={formData.confirmCalculations}
            onChange={handleChange}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="confirmCalculations" className="text-xs font-medium">
            Yes, I am confident my calculations are correct.*
          </label>
        </div>
      </div>

      <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
        <p className="text-sm text-gray-700">
          Your personal data will be used to process your order, support your experience throughout this website, and
          for other purposes described in our Privacy policy.
        </p>
        <div className="flex items-start space-x-2 mt-4">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="agreeToTerms" className="text-xs font-medium">
            I have read and agree to the website{" "}
            <a href="#" className="underline">
              Terms and conditions
            </a>
            *
          </label>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          PREVIOUS
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          disabled={!formData.agreeToTerms || !formData.confirmCalculations}
        >
          PLACE ORDER
        </button>
      </div>
    </form>
  )
}

export default PaymentForm
