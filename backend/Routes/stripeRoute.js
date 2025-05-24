import { Router, raw } from "express"
const router = Router()
import { createCheckoutSession, createPaymentIntent, processPayment, handleWebhook } from "./../Controllers/StripeController.js"

// Create a checkout session
router.post("/create-checkout-session", createCheckoutSession)

// Create a payment intent
router.post("/create-payment-intent", createPaymentIntent)

// Process a payment
router.post("/process-payment", processPayment)

// Handle webhook events
// Note: For webhook route, we need raw body for signature verification
router.post("/webhook", raw({ type: "application/json" }), handleWebhook)

export default router
