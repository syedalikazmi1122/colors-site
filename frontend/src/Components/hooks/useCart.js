"use client"

import { useState, useEffect } from "react"

export function useCart() {
  const [items, setItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  // Add item to cart
  const addItem = (item) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, item]
      }
    })
  }

  // Remove item from cart
  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
  }

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Calculate total items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  }
}
