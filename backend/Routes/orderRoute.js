import { Router } from "express"
import { 
  getOrderBySessionId, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus, 
  getOrderDetails 
} from "../Controllers/Order/index.js"
import { isAdmin } from "../Middleware/auth.js"

const router = Router()

// Get order by session ID
router.get("/session/:sessionId", getOrderBySessionId)

// Get user orders
router.get("/user/:userId", getUserOrders)

// Get all orders (admin only)
router.get("/all", isAdmin, getAllOrders)

// Update order status (admin only)
router.put("/:orderId/status", isAdmin, updateOrderStatus)

// Get order details
router.get("/:orderId", getOrderDetails)

export default router 