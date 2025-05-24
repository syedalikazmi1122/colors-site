"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Search, Filter, ChevronDown, ChevronUp, Package, CheckCircle, Clock, X } from "lucide-react"
import sendRequest from "../../Utils/apirequest"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    // Fetch orders from your API
    const fetchOrders = async () => {
      try {
        setLoading(true)
        // Replace with your actual API endpoint
        const response = await sendRequest(`get`,`/admin/orders`,{});
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()
        setOrders(data)
        setFilteredOrders(data)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching orders:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

    // For demo purposes, set mock data if no API is available
    setTimeout(() => {
      if (loading) {
        setOrders(mockOrders)
        setFilteredOrders(mockOrders)
        setLoading(false)
      }
    }, 1000)
  }, [])

  useEffect(() => {
    // Apply filters and search
    let result = [...orders]

    // Apply search
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase()
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(lowercasedSearch) ||
          order.customer.name.toLowerCase().includes(lowercasedSearch) ||
          order.customer.email.toLowerCase().includes(lowercasedSearch),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)
      const lastMonth = new Date(today)
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      result = result.filter((order) => {
        const orderDate = new Date(order.orderDate)
        switch (dateFilter) {
          case "today":
            return orderDate >= today
          case "yesterday":
            return orderDate >= yesterday && orderDate < today
          case "last7days":
            return orderDate >= lastWeek
          case "last30days":
            return orderDate >= lastMonth
          default:
            return true
        }
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.orderDate) - new Date(b.orderDate)
          break
        case "total":
          comparison = a.total - b.total
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "customer":
          comparison = a.customer.name.localeCompare(b.customer.name)
          break
        default:
          comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredOrders(result)
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder])

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const handleMarkAsDispatched = async (orderId) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/admin/orders/${orderId}/dispatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "dispatched",
          dispatchDate: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "dispatched", dispatchDate: new Date().toISOString() } : order,
        ),
      )

      alert(`Order #${orderId} marked as dispatched`)
    } catch (err) {
      console.error("Error updating order:", err)
      alert(`Error: ${err.message}`)
    }

    // For demo purposes, update the mock data directly
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "dispatched", dispatchDate: new Date().toISOString() } : order,
      ),
    )
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/admin/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to cancel order")
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled", cancelDate: new Date().toISOString() } : order,
        ),
      )

      alert(`Order #${orderId} has been cancelled`)
    } catch (err) {
      console.error("Error cancelling order:", err)
      alert(`Error: ${err.message}`)
    }

    // For demo purposes, update the mock data directly
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled", cancelDate: new Date().toISOString() } : order,
      ),
    )
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "dispatched":
        return <Package className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "dispatched":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return null
    return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-serif mb-8">Order Management</h1>
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Loading orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-serif mb-8">Order Management</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>Error loading orders: {error}</p>
            <button className="mt-2 text-sm underline" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-serif mb-4 sm:mb-0">Order Management</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900"
              onClick={() => window.print()}
            >
              Export Orders
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by order #, customer name, or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-md">
                <div>
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    id="dateFilter"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sortBy"
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-")
                      setSortBy(field)
                      setSortOrder(order)
                    }}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="date-desc">Date (Newest First)</option>
                    <option value="date-asc">Date (Oldest First)</option>
                    <option value="total-desc">Total (High to Low)</option>
                    <option value="total-asc">Total (Low to High)</option>
                    <option value="status-asc">Status (A-Z)</option>
                    <option value="customer-asc">Customer Name (A-Z)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center">Order Date {getSortIcon("date")}</div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("customer")}
                    >
                      <div className="flex items-center">Customer {getSortIcon("customer")}</div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center">Total {getSortIcon("total")}</div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">Status {getSortIcon("status")}</div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No orders found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <React.Fragment key={order.id}>
                        <tr
                          className={`hover:bg-gray-50 ${expandedOrder === order.id ? "bg-gray-50" : ""}`}
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{order.customer.name}</div>
                            <div className="text-xs">{order.customer.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                              {order.status === "pending" && (
                                <button
                                  onClick={() => handleMarkAsDispatched(order.id)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Process
                                </button>
                              )}
                              {order.status === "processing" && (
                                <button
                                  onClick={() => handleMarkAsDispatched(order.id)}
                                  className="text-purple-600 hover:text-purple-900"
                                >
                                  Dispatch
                                </button>
                              )}
                              {["pending", "processing"].includes(order.status) && (
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleOrderDetails(order.id)
                                }}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                {expandedOrder === order.id ? "Hide" : "View"}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expandedOrder === order.id && (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-4">Order Items</h4>
                                  <div className="space-y-4">
                                    {order.items.map((item) => (
                                      <div key={item.id} className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                          <img
                                            src={item.image || "https://via.placeholder.com/64x64"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="text-sm font-medium">{item.name}</h5>
                                          <p className="text-xs text-gray-500">
                                            {item.color && `Color: ${item.color}`}
                                            {item.width && ` • Width: ${item.width}`}
                                            {item.height && ` • Height: ${item.height}`}
                                          </p>
                                          <div className="flex justify-between mt-1">
                                            <span className="text-xs">Qty: {item.quantity}</span>
                                            <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="mt-4 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between mb-2">
                                      <span className="text-sm text-gray-600">Subtotal</span>
                                      <span className="text-sm font-medium">${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="text-sm text-gray-600">Shipping</span>
                                      <span className="text-sm font-medium">${order.shipping.toFixed(2)}</span>
                                    </div>
                                    {order.tax > 0 && (
                                      <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Tax</span>
                                        <span className="text-sm font-medium">${order.tax.toFixed(2)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                                      <span className="text-base font-medium">Total</span>
                                      <span className="text-base font-medium">${order.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <div className="mb-6">
                                    <h4 className="font-medium mb-2">Customer Information</h4>
                                    <p className="text-sm">
                                      <span className="font-medium">Name:</span> {order.customer.name}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Email:</span> {order.customer.email}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Phone:</span> {order.customer.phone}
                                    </p>
                                  </div>

                                  <div className="mb-6">
                                    <h4 className="font-medium mb-2">Shipping Address</h4>
                                    <address className="text-sm text-gray-600 not-italic">
                                      {order.shippingAddress.name}
                                      <br />
                                      {order.shippingAddress.street}
                                      <br />
                                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                      {order.shippingAddress.zip}
                                      <br />
                                      {order.shippingAddress.country}
                                    </address>
                                  </div>

                                  <div className="mb-6">
                                    <h4 className="font-medium mb-2">Payment Information</h4>
                                    <p className="text-sm">
                                      <span className="font-medium">Method:</span> {order.paymentMethod}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Transaction ID:</span>{" "}
                                      {order.transactionId || "N/A"}
                                    </p>
                                  </div>

                                  {order.status === "dispatched" && (
                                    <div className="mb-6">
                                      <h4 className="font-medium mb-2">Shipping Information</h4>
                                      <p className="text-sm">
                                        <span className="font-medium">Dispatched Date:</span>{" "}
                                        {order.dispatchDate ? new Date(order.dispatchDate).toLocaleDateString() : "N/A"}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">Tracking Number:</span>{" "}
                                        {order.trackingNumber || "N/A"}
                                      </p>
                                      {order.trackingUrl && (
                                        <a
                                          href={order.trackingUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-indigo-600 hover:text-indigo-900"
                                        >
                                          Track Package
                                        </a>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex flex-wrap gap-2">
                                    {order.status === "pending" && (
                                      <button
                                        onClick={() => handleMarkAsDispatched(order.id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                      >
                                        Process Order
                                      </button>
                                    )}

                                    {order.status === "processing" && (
                                      <button
                                        onClick={() => handleMarkAsDispatched(order.id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                                      >
                                        Mark as Dispatched
                                      </button>
                                    )}

                                    {["pending", "processing"].includes(order.status) && (
                                      <button
                                        onClick={() => handleCancelOrder(order.id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                      >
                                        Cancel Order
                                      </button>
                                    )}

                                    <button
                                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                      onClick={() => window.open(`/admin/orders/${order.id}/print`, "_blank")}
                                    >
                                      Print Order
                                    </button>

                                    <button
                                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                      onClick={() => window.open(`/admin/orders/${order.id}/invoice`, "_blank")}
                                    >
                                      Print Invoice
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-medium mb-4">Order Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="text-2xl font-semibold mt-1">{orders.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-700">Pending Orders</h3>
              <p className="text-2xl font-semibold mt-1">
                {orders.filter((order) => order.status === "pending").length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-700">Dispatched Today</h3>
              <p className="text-2xl font-semibold mt-1">
                {
                  orders.filter((order) => {
                    if (order.status !== "dispatched") return false
                    const today = new Date()
                    const dispatchDate = new Date(order.dispatchDate || order.orderDate)
                    return (
                      dispatchDate.getDate() === today.getDate() &&
                      dispatchDate.getMonth() === today.getMonth() &&
                      dispatchDate.getFullYear() === today.getFullYear()
                    )
                  }).length
                }
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700">Total Revenue</h3>
              <p className="text-2xl font-semibold mt-1">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mock data for demonstration
const mockOrders = [
  {
    id: "ord_1",
    orderNumber: "ORD-2023-1001",
    orderDate: "2023-05-15T10:30:00Z",
    status: "delivered",
    subtotal: 314.0,
    shipping: 0,
    tax: 25.12,
    total: 339.12,
    items: [
      {
        id: "item_1",
        name: "Oriental Garden Wallpaper",
        price: 157.0,
        quantity: 2,
        image: "https://via.placeholder.com/64x64",
        color: "Light Blue",
        width: "16ft",
        height: "9ft",
      },
    ],
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    },
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    paymentMethod: "Credit Card",
    transactionId: "pi_3NqF8J2eZvKYlo2C1gkNxaE2",
    dispatchDate: "2023-05-16T09:15:00Z",
    trackingNumber: "1Z999AA10123456784",
    trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456784",
  },
  {
    id: "ord_2",
    orderNumber: "ORD-2023-1002",
    orderDate: "2023-05-20T14:45:00Z",
    status: "dispatched",
    subtotal: 157.0,
    shipping: 0,
    tax: 12.56,
    total: 169.56,
    items: [
      {
        id: "item_2",
        name: "Floral Pattern Wallpaper",
        price: 157.0,
        quantity: 1,
        image: "https://via.placeholder.com/64x64",
        color: "Cream",
        width: "12ft",
        height: "8ft",
      },
    ],
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
    },
    shippingAddress: {
      name: "Jane Smith",
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "United States",
    },
    paymentMethod: "PayPal",
    transactionId: "pi_3NqF8J2eZvKYlo2C1gkNxaE3",
    dispatchDate: "2023-05-21T10:30:00Z",
    trackingNumber: "1Z999AA10123456785",
    trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456785",
  },
  {
    id: "ord_3",
    orderNumber: "ORD-2023-1003",
    orderDate: "2023-05-25T09:15:00Z",
    status: "processing",
    subtotal: 314.0,
    shipping: 0,
    tax: 25.12,
    total: 339.12,
    items: [
      {
        id: "item_3",
        name: "Geometric Wallpaper",
        price: 157.0,
        quantity: 1,
        image: "https://via.placeholder.com/64x64",
        color: "Gray",
        width: "10ft",
        height: "8ft",
      },
      {
        id: "item_4",
        name: "Abstract Wallpaper",
        price: 157.0,
        quantity: 1,
        image: "https://via.placeholder.com/64x64",
        color: "Multi",
        width: "10ft",
        height: "8ft",
      },
    ],
    customer: {
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+1 (555) 456-7890",
    },
    shippingAddress: {
      name: "Robert Johnson",
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zip: "60007",
      country: "United States",
    },
    paymentMethod: "Credit Card",
    transactionId: "pi_3NqF8J2eZvKYlo2C1gkNxaE4",
  },
  {
    id: "ord_4",
    orderNumber: "ORD-2023-1004",
    orderDate: "2023-05-30T16:20:00Z",
    status: "pending",
    subtotal: 157.0,
    shipping: 0,
    tax: 12.56,
    total: 169.56,
    items: [
      {
        id: "item_5",
        name: "Tropical Wallpaper",
        price: 157.0,
        quantity: 1,
        image: "https://via.placeholder.com/64x64",
        color: "Green",
        width: "14ft",
        height: "9ft",
      },
    ],
    customer: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1 (555) 234-5678",
    },
    shippingAddress: {
      name: "Emily Davis",
      street: "321 Maple Rd",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "United States",
    },
    paymentMethod: "Credit Card",
    transactionId: "pi_3NqF8J2eZvKYlo2C1gkNxaE5",
  },
  {
    id: "ord_5",
    orderNumber: "ORD-2023-1005",
    orderDate: "2023-06-02T11:10:00Z",
    status: "cancelled",
    subtotal: 157.0,
    shipping: 0,
    tax: 12.56,
    total: 169.56,
    items: [
      {
        id: "item_6",
        name: "Minimalist Wallpaper",
        price: 157.0,
        quantity: 1,
        image: "https://via.placeholder.com/64x64",
        color: "White",
        width: "12ft",
        height: "8ft",
      },
    ],
    customer: {
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      phone: "+1 (555) 876-5432",
    },
    shippingAddress: {
      name: "Michael Wilson",
      street: "654 Elm St",
      city: "Boston",
      state: "MA",
      zip: "02108",
      country: "United States",
    },
    paymentMethod: "Credit Card",
    transactionId: "pi_3NqF8J2eZvKYlo2C1gkNxaE6",
    cancelDate: "2023-06-03T09:45:00Z",
  },
]

export default AdminOrders
