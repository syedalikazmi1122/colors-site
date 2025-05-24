const Order = require("../Models/Order")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

/**
 * Create an order in the database from a Stripe checkout session
 * @param {Object} session - Stripe checkout session
 * @returns {Promise<Object>} - Created order
 */
exports.createOrderFromSession = async (session) => {
  try {
    // Retrieve the session with line items
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "customer", "shipping_details"],
    })

    const lineItems = expandedSession.line_items.data
    const userId = session.metadata.userId

    // Extract shipping and billing details
    const shippingDetails = expandedSession.shipping_details
    const billingDetails = expandedSession.customer_details

    // Calculate totals
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount_total / 100, 0)
    const tax = (expandedSession.total_details?.amount_tax || 0) / 100
    const shipping = (expandedSession.total_details?.amount_shipping || 0) / 100
    const total = expandedSession.amount_total / 100

    // Create items array
    const items = lineItems.map((item) => {
      // Extract product details from description or metadata
      const description = item.description || ""
      const parts = description.split(",")

      let color = ""
      let width = ""
      let height = ""

      parts.forEach((part) => {
        if (part.includes("Color:")) color = part.replace("Color:", "").trim()
        if (part.includes("Width:")) width = part.replace("Width:", "").trim()
        if (part.includes("Height:")) height = part.replace("Height:", "").trim()
      })

      return {
        productId: item.price.product,
        name: item.description,
        price: item.amount_total / 100 / item.quantity,
        quantity: item.quantity,
        image: item.price.product.images?.[0] || "",
        color,
        width,
        height,
      }
    })

    // Create the order
    const order = new Order({
      userId,
      items,
      billingDetails: {
        firstName: billingDetails.name?.split(" ")[0] || "",
        lastName: billingDetails.name?.split(" ").slice(1).join(" ") || "",
        email: billingDetails.email,
        phone: billingDetails.phone || "",
        address: {
          street1: billingDetails.address?.line1 || "",
          street2: billingDetails.address?.line2 || "",
          city: billingDetails.address?.city || "",
          state: billingDetails.address?.state || "",
          zipCode: billingDetails.address?.postal_code || "",
          country: billingDetails.address?.country || "",
        },
      },
      shippingDetails: shippingDetails
        ? {
            firstName: shippingDetails.name?.split(" ")[0] || "",
            lastName: shippingDetails.name?.split(" ").slice(1).join(" ") || "",
            address: {
              street1: shippingDetails.address?.line1 || "",
              street2: shippingDetails.address?.line2 || "",
              city: shippingDetails.address?.city || "",
              state: shippingDetails.address?.state || "",
              zipCode: shippingDetails.address?.postal_code || "",
              country: shippingDetails.address?.country || "",
            },
          }
        : null,
      paymentDetails: {
        paymentMethod: "stripe",
        stripeSessionId: session.id,
        status: "paid",
      },
      subtotal,
      tax,
      shipping,
      total,
      status: "processing",
    })

    await order.save()
    return order
  } catch (error) {
    console.error("Error creating order from session:", error)
    throw error
  }
}

/**
 * Update order status based on payment intent
 * @param {Object} paymentIntent - Stripe payment intent
 * @returns {Promise<Object>} - Updated order
 */
exports.updateOrderFromPaymentIntent = async (paymentIntent) => {
  try {
    // Find the order by payment intent ID
    const order = await Order.findOne({
      "paymentDetails.paymentIntentId": paymentIntent.id,
    })

    if (!order) {
      console.error(`No order found for payment intent ${paymentIntent.id}`)
      return null
    }

    // Update order status
    order.paymentDetails.status = "paid"
    order.status = "processing"

    await order.save()
    return order
  } catch (error) {
    console.error("Error updating order from payment intent:", error)
    throw error
  }
}
