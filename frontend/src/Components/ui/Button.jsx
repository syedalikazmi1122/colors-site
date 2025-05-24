"use client"

const Button = ({
  children,
  type = "button",
  variant = "default",
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantStyles = {
    default: "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    link: "bg-transparent text-gray-600 hover:text-gray-900 hover:underline p-0",
  }

  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`

  return (
    <button type={type} className={styles} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button
