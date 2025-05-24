"use client"

import { createContext, useContext, useState } from "react"

const CheckoutContext = createContext(undefined)

export function CheckoutProvider({ children }) {
  const [step, setStep] = useState("cart")
  const [billingData, setBillingData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <CheckoutContext.Provider
      value={{
        step,
        setStep,
        billingData,
        setBillingData,
        paymentData,
        setPaymentData,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
}
