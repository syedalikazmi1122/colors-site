function Wishlist() {
    // Mock wishlist items
    const wishlistItems = []
  
    return (
      <div>
        <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">Wishlist</h2>
  
        {wishlistItems.length === 0 ? (
          <div className="py-6">
            <p className="mb-2">Your wishlist is empty.</p>
            <a href="/shop" className="text-gray-700 hover:underline">
              Continue shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {wishlistItems.map((item) => (
              <WishlistItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    )
  }
  
  function WishlistItem({ item }) {
    return (
      <div className="border border-gray-200 rounded-sm overflow-hidden">
        <div className="aspect-square relative">
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="object-cover w-full h-full" />
        </div>
        <div className="p-4">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-gray-900 mt-1">${item.price.toFixed(2)}</p>
          <div className="mt-4 flex space-x-2">
            <button className="bg-gray-900 text-white px-3 py-1 text-sm rounded-sm hover:bg-gray-800 transition-colors flex-1">
              Add to Cart
            </button>
            <button className="border border-gray-300 text-gray-700 px-3 py-1 text-sm rounded-sm hover:bg-gray-50 transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default Wishlist
  
  