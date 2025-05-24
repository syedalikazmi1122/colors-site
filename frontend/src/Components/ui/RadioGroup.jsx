"use client"

import { createContext, useContext } from "react"

const RadioGroupContext = createContext(null)

export const RadioGroup = ({ value, onValueChange, children, className = "" }) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </RadioGroupContext.Provider>
  )
}

export const RadioGroupItem = ({ value, id, className = "", ...props }) => {
  const context = useContext(RadioGroupContext)

  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup")
  }

  const { value: groupValue, onValueChange } = context

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={groupValue === value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 ${className}`}
      {...props}
    />
  )
}
