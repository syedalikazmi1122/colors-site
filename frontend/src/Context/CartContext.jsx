import { createContext, useContext, useState, useEffect } from 'react'
import sendRequest from '../Utils/apirequest'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch cart on initial load
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await sendRequest('get', '/cart')
      setCart(response.data.items || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product) => {
    try {
      const response = await sendRequest('post', '/cart/add', { product })
      setCart(response.data.items)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const response = await sendRequest('delete', `/cart/${productId}`)
      setCart(response.data.items)
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await sendRequest('put', `/cart/${productId}`, { quantity })
      setCart(response.data.items)
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext 