"use client"

import { useState } from "react"

const OrderSummary = ({
  subtotal,
  shipping,
  tax,
  total,
  items = [],
  showItems = false,
  showCouponInput = true,
  showCheckoutButton = true,
  onApplyCoupon,
  onCheckout,
  onContinueShopping,
}) => {
  const [coupon, setCoupon] = useState("")

  return (
    <div className="bg-white border-t md:border md:border-gray-200 md:rounded-none">
      <div className="bg-gray-500 text-white py-3 px-4 text-center font-medium">ORDER SUMMARY</div>

      {showItems && items.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 mb-3">
              <div className="w-16 h-16 bg-gray-100 overflow-hidden">
                <img
                  src={item.image || "https://via.placeholder.com/64x64"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium">{item.name}</h4>
                <p className="text-xs text-gray-500">
                  {item.color && (
                    <span>
                      COLOR: {item.color}
                      <br />
                    </span>
                  )}
                  {item.width && <span>Width: {item.width} </span>}
                  {item.height && <span>• Height: {item.height}</span>}
                </p>
                <div className="flex justify-between mt-1">
                  <span className="text-xs">QTY: {item.quantity}</span>
                  <span className="text-sm font-medium">${item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">SUBTOTAL</span>
          <span className="text-sm font-medium">${subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-600">SHIPPING</span>
          <span className="text-sm font-medium">{shipping === 0 ? "FREE SHIPPING: $0" : `$${shipping}`}</span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">TAX</span>
            <span className="text-sm font-medium">${tax}</span>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-base font-medium">TOTAL</span>
            <span className="text-base font-medium">${total}</span>
          </div>
        </div>

        {shipping === 0 && <p className="text-sm text-gray-500">Shipping options will be updated during checkout.</p>}

        <div className="pt-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="text-sm">
              or 4 interest-free payments of ${(total / 4).toFixed(2)} with
              <span className="inline-block ml-2 align-middle">
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
              </span>
            </p>
          </div>
        </div>

        {showCouponInput && (
          <div className="flex gap-2 pt-2">
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="COUPON/GIFT CARD"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              onClick={() => onApplyCoupon?.(coupon)}
            >
              APPLY
            </button>
          </div>
        )}

        {showCheckoutButton && (
          <div className="pt-2 space-y-4">
            <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-md" onClick={onCheckout}>
              CHECKOUT
            </button>

            <button
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
              onClick={onContinueShopping}
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>

      {showCheckoutButton && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium mb-2">WE ACCEPT</p>
            <div className="flex justify-center gap-2">
              <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                    fill="white"
                  />
                  <path d="M9.5 5.5H14.5V10.5H9.5V5.5Z" fill="#2566AF" />
                  <path d="M10 12H7L8 8H11L10 12Z" fill="#EB001B" />
                  <path d="M17 12H14L13 8H16L17 12Z" fill="#00A2E5" />
                </svg>
              </div>
              <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
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
              </div>
              <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                    fill="white"
                  />
                  <path
                    d="M12 12.5C14.4853 12.5 16.5 10.4853 16.5 8C16.5 5.51472 14.4853 3.5 12 3.5C9.51472 3.5 7.5 5.51472 7.5 8C7.5 10.4853 9.51472 12.5 12 12.5Z"
                    fill="#0079BE"
                  />
                </svg>
              </div>
              <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
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
              <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                    fill="white"
                  />
                  <path d="M14 6H10L7 10H11L14 6Z" fill="#FF5F00" />
                  <path d="M17 10H13L10 6H14L17 10Z" fill="#FF5F00" />
                </svg>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-2">
              <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                    fill="white"
                  />
                  <path
                    d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                    fill="black"
                  />
                </svg>
              </div>
              <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                    fill="white"
                  />
                  <path
                    d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                    fill="#3C8AF0"
                  />
                </svg>
              </div>
              <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                    fill="#B2DDC8"
                  />
                  <path
                    d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                    fill="#3C4858"
                  />
                </svg>
              </div>
              <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                    fill="#FFB3C7"
                  />
                  <path
                    d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                    fill="#3C4858"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderSummary
