"use client"

import { CreditCard, Package, Heart, LogOut, User, Lock } from "lucide-react"
import useAuthStore from "./../../Zustand/profileAuthStore" // Adjust the path to your Zustand store

function AccountSidebar({ activeTab, setActiveTab }) {
  const logout = useAuthStore((state) => state.logout) // Access the logout function from Zustand

  const navItems = [
    { id: "account", label: "Account Information", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "logout", label: "Logout", icon: LogOut },
  ]

  return (
    <>
      {/* Sidebar Navigation - Mobile Dropdown */}
      <div className="md:hidden w-full mb-6">
        <select
          className="w-full p-2 border border-gray-200 rounded"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          {navItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sidebar Navigation - Desktop */}
      <div className="hidden md:block w-full md:w-64 shrink-0">
        <h2 className="text-xl font-medium mb-6">My Account & Orders</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`w-full text-left py-2 flex items-center space-x-2 hover:text-gray-900 ${
                  activeTab === item.id ? "text-gray-900 font-medium" : "text-gray-600"
                }`}
                onClick={() => {
                  if (item.id === "logout") {
                    localStorage.removeItem("token") // Remove token from local storage
                    logout() // Call the logout function
                  } else {
                    setActiveTab(item.id)
                  }
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export default AccountSidebar
