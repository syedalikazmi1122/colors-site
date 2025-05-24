"use client"

const Checkbox = ({ id, name, checked, onChange, className = "" }) => {
  return (
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
      className={`h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded ${className}`}
    />
  )
}

export default Checkbox
