import Stripe from "stripe"
import Order from "../Models/Order/index.js"
import Cart from "../Models/Cart/index.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Create a Stripe checkout session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function createCheckoutSession(req, res) {
  try {
    console.log(req.body.items[0].price_data);
    const { items, billingDetails, userId = "guest" } = req.body

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      line_items: items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: {
        userId: userId,
      },
    })
    res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    res.status(500).json({ error: error.message || "Error creating checkout session" })
  }
}

/**
 * Create a payment intent for Stripe Elements
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function createPaymentIntent(req, res) {
  try {
    const { amount } = req.body

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    res.status(500).json({ error: "Error creating payment intent" })
  }
}

/**
 * Process a direct payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function processPayment(req, res) {
  try {
    const { amount, billingDetails } = req.body

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: "usd",
      payment_method_types: ["card"],
      description: "Order payment",
      receipt_email: billingDetails.email,
      metadata: {
        customer_name: `${billingDetails.firstName} ${billingDetails.lastName}`,
        customer_email: billingDetails.email,
      },
    })

    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Error processing payment:", error)
    res.status(500).json({ error: "Error processing payment" })
  }
}

/**
 * Handle Stripe webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function handleWebhook(req, res) {
  const signature = req.headers["stripe-signature"]
  let event

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body, // use req.body, not req.rawBody
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object
      // Fulfill the order
      await handleCheckoutSessionCompleted(session)
      break
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object
      // Process successful payment
      await handlePaymentIntentSucceeded(paymentIntent)
      break
    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object
      // Handle failed payment
      await handlePaymentIntentFailed(failedPaymentIntent)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.status(200).json({ received: true })
}

/**
 * Handle a completed checkout session
 * @param {Object} session - Stripe checkout session
 */
async function handleCheckoutSessionCompleted(session) {
  try {
    // Retrieve the session with line items and customer details
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "customer", "shipping_details"]
    })

    const lineItems = expandedSession.line_items.data
    const userId = session.metadata.userId
    const customer = expandedSession.customer_details
    const shipping = expandedSession.shipping_details

    // Create order items array
    const items = lineItems.map(item => ({
      productId: item.price.product.metadata.productId,
      name: item.description,
      price: item.amount_total / 100 / item.quantity,
      quantity: item.quantity,
      image: item.price.product.images?.[0] || "",
      material: item.price.product.metadata.material,
      category: item.price.product.metadata.category
    }))

    // Create new order
    const order = new Order({
      userId,
      items,
      status: 'processing',
      totalAmount: expandedSession.amount_total / 100,
      shippingAddress: {
        street1: shipping?.address?.line1 || "",
        street2: shipping?.address?.line2 || "",
        city: shipping?.address?.city || "",
        state: shipping?.address?.state || "",
        zipCode: shipping?.address?.postal_code || "",
        country: shipping?.address?.country || ""
      },
      billingAddress: {
        street1: customer?.address?.line1 || "",
        street2: customer?.address?.line2 || "",
        city: customer?.address?.city || "",
        state: customer?.address?.state || "",
        zipCode: customer?.address?.postal_code || "",
        country: customer?.address?.country || ""
      },
      paymentDetails: {
        paymentMethod: "stripe",
        stripeSessionId: session.id,
        status: "paid",
        paymentDate: new Date(),
        transactionId: session.payment_intent
      },
      customerDetails: {
        email: customer?.email || "",
        name: customer?.name || "",
        phone: customer?.phone || ""
      },
      orderDate: new Date(),
      estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      notes: "Order placed through Stripe checkout"
    })

    await order.save()
    console.log(`Order ${order.orderNumber} created for user ${userId}`)

    // Clear the user's cart after successful order
    if (userId !== "guest") {
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } }
      )
      console.log(`Cart cleared for user ${userId}`)
    }

    return order; // Return the created order for potential further processing

  } catch (error) {
    console.error("Error handling checkout session completed:", error)
    throw error
  }
}

/**
 * Handle a successful payment intent
 * @param {Object} paymentIntent - Stripe payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    // Here you would typically:
    // 1. Update payment status in your database
    // 2. Send payment confirmation

    console.log(`Payment succeeded for intent ${paymentIntent.id}`)
  } catch (error) {
    console.error("Error handling payment intent succeeded:", error)
  }
}

/**
 * Handle a failed payment intent
 * @param {Object} paymentIntent - Stripe payment intent
 */
async function handlePaymentIntentFailed(paymentIntent) {
  try {
    // Here you would typically:
    // 1. Update payment status in your database
    // 2. Notify customer of failed payment
    // 3. Potentially retry payment or offer alternative payment methods

    console.log(`Payment failed for intent ${paymentIntent.id}: ${paymentIntent.last_payment_error?.message}`)
  } catch (error) {
    console.error("Error handling payment intent failed:", error)
  }
}
