"use client"

const Select = ({ id, name, value, onChange, children, className = "", ...props }) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export default Select
