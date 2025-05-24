"use client"
import { Minus, Plus } from "lucide-react"

const CartItem = ({
  id,
  name,
  price,
  image,
  quantity,
  type = "",
  color = "",
  width = "",
  height = "",
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="py-6 border-b border-gray-200">
      <div className="flex items-start gap-6">
        <div className="w-28 h-36 bg-gray-100 overflow-hidden">
          <img src={image || "https://via.placeholder.com/112x144"} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>

          <div className="mt-1 space-y-1">
            <div className="text-sm text-gray-500">
              <span className="font-medium">PRICE</span>
              <p className="text-gray-900">${price}</p>
            </div>

            {type && (
              <div className="text-sm text-gray-500">
                <span className="font-medium">TYPE</span>
                <p>{type}</p>
              </div>
            )}

            {color && (
              <div className="text-sm text-gray-500">
                <span className="font-medium">COLOR</span>
                <p>{color}</p>
              </div>
            )}

            {(width || height) && (
              <div className="text-sm text-gray-500">
                <span className="font-medium">SIZE</span>
                <p>
                  Width: {width} {height && `• Height: ${height}`}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="text-xl font-medium">${price}</div>

          <div className="flex items-center border border-gray-300">
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
              onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="w-10 h-8 flex items-center justify-center text-gray-900">{quantity}</div>

            <button
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
              onClick={() => onUpdateQuantity(id, quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button className="text-sm text-gray-500 hover:text-gray-700 uppercase" onClick={() => onRemove(id)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
