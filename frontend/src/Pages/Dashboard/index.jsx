"use client"

import { useState } from "react"
import { CreditCard, Package, Heart, LogOut, User, Lock } from "lucide-react"
import Navbar from "./../../Components/Navbar"
import Footer from "./../../Components/Footer"
import AccountSidebar from "./../../Components/Dashboard/Sidebar"
import AccountInformation from "./../../Components/Dashboard/AccountInformation"
import OrdersSection from "./../../Components/Dashboard/OrdersSection"
import PaymentMethods from "./../../Components/Dashboard/PaymentMethods"
import ChangePassword from "./../../Components/Dashboard/ChangePassword"
import Wishlist from "./../../Components/Dashboard/Wishlist"
import useProfileAuthStore from "../../Zustand/profileAuthStore"
function AccountLayout() {
  const [activeTab, setActiveTab] = useState("account")
  const [userData, setUserData] = useState({
    name: useProfileAuthStore((state) => state.name),
    email: useProfileAuthStore((state) => state.email),
    role: useProfileAuthStore((state) => state.role),
    country:'',
    address:'',
  })
  console.log("userData", userData)
  const isLoggedIn = useProfileAuthStore((state) => state.isLoggedIn)
  // Mock orders data
  const orders = []

  // Navigation items with icons
  const navItems = [
    { id: "account", label: "Account Information", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "logout", label: "Logout", icon: LogOut },
  ]

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountInformation userData={userData} />
      case "orders":
        return <OrdersSection orders={orders} />
      case "payment":
        return <PaymentMethods />
      case "password":
        return <ChangePassword />
      case "wishlist":
        return <Wishlist />
      default:
        return <AccountInformation  />
    }
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto px-4 sm:px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-serif mb-8">My Account & Orders</h1>
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AccountLayout

