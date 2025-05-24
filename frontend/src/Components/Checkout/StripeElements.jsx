"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import StripePaymentForm from "./StripePaymentForm"

// Load the Stripe.js library with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

const StripeElements = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create a PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        })

        if (!response.ok) {
          throw new Error("Failed to create payment intent")
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Error creating payment intent:", error)
        onPaymentError(error.message)
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [amount, onPaymentError])

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#6b7280",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  if (loading) {
    return <div className="text-center py-4">Loading payment form...</div>
  }

  if (!clientSecret) {
    return <div className="text-center py-4 text-red-500">Failed to initialize payment form</div>
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentForm onPaymentSuccess={onPaymentSuccess} onPaymentError={onPaymentError} />
    </Elements>
  )
}

export default StripeElements
