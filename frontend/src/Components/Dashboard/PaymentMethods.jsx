function PaymentMethods() {
    return (
      <div>
        <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">Payment Methods</h2>
  
        <div className="py-6">
          <p className="mb-4">You don't have any saved payment methods.</p>
  
          <button className="bg-gray-900 text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors">
            Add Payment Method
          </button>
        </div>
      </div>
    )
  }
  
  export default PaymentMethods
  
  