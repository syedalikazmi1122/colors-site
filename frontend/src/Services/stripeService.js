import { loadStripe } from "@stripe/stripe-js"

// Load the Stripe.js library with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "")

// API base URL
const API_URL = "http://localhost:3001"

/**
 * Create a checkout session with Stripe
 * @param {Array} items - Cart items
 * @param {Object} billingDetails - Customer billing details
 * @param {string} userId - User ID (optional)
 * @returns {Promise<Object>} - Response with session ID and URL
 */
export const createCheckoutSession = async (items, billingDetails, userId = "guest") => {
  try {
    const response = await fetch(`${API_URL}/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        billingDetails,
        userId,
      }),
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const { sessionId, url } = await response.json()

    // If using Stripe Checkout redirect flow
    if (url) {
      window.location.href = url
      return { success: true }
    }

    // If using Stripe Elements or other direct integration
    const stripe = await stripePromise
    const { error } = await stripe.redirectToCheckout({ sessionId })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Create a payment intent for Stripe Elements
 * @param {number} amount - Payment amount
 * @returns {Promise<Object>} - Response with client secret
 */
export const createPaymentIntent = async (amount) => {
  try {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    })

    if (!response.ok) {
      throw new Error("Failed to create payment intent")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}

/**
 * Process a direct payment with card details
 * @param {string} paymentMethod - Payment method ID
 * @param {number} amount - Payment amount
 * @param {Object} billingDetails - Customer billing details
 * @returns {Promise<Object>} - Response with payment result
 */
export const processPayment = async (paymentMethod, amount, billingDetails) => {
  try {
    const stripe = await stripePromise

    const response = await fetch(`${API_URL}/process-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethod,
        amount,
        billingDetails,
      }),
    })

    if (!response.ok) {
      throw new Error("Payment processing failed")
    }

    const { clientSecret } = await response.json()

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    })

    if (error) {
      throw error
    }

    return { success: true, paymentIntent }
  } catch (error) {
    console.error("Payment error:", error)
    return { success: false, error: error.message }
  }
}
