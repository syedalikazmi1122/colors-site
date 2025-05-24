"use client"

const Input = ({
  id,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${className}`}
      {...props}
    />
  )
}

export default Input
