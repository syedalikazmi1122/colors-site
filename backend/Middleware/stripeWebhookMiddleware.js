/**
 * Middleware to preserve raw body for Stripe webhook signature verification
 */
const stripeWebhookMiddleware = (req, res, next) => {
  // Store raw body for Stripe webhook signature verification
  if (req.originalUrl === "/api/stripe/webhook") {
    let data = ""
    req.on("data", (chunk) => {
      data += chunk
    })

    req.on("end", () => {
      req.rawBody = data
      next()
    })
  } else {
    next()
  }
}

export default stripeWebhookMiddleware
