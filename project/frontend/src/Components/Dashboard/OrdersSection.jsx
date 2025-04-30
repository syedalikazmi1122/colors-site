function OrdersSection({ orders }) {
    return (
      <div>
        <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">Orders</h2>
  
        {orders.length === 0 ? (
          <div className="py-6">
            <p className="mb-2">You haven't placed any orders yet.</p>
            <a href="/shop" className="text-gray-700 hover:underline">
              Continue shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 p-4 rounded">
                <div className="flex justify-between mb-2">
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-gray-500">{order.date}</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">Status: {order.status}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                  <button className="text-gray-700 hover:underline">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  export default OrdersSection
  
  