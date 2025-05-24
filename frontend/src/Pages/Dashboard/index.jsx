"use client"

import { useState } from "react";
import Navbar from "./../../Components/Navbar"
import Footer from "./../../Components/Footer"
import AccountSidebar from "./../../Components/Dashboard/Sidebar"
import AccountInformation from "./../../Components/Dashboard/AccountInformation"
import OrdersSection from "./../../Components/Dashboard/OrdersSection"
import PaymentMethods from "./../../Components/Dashboard/PaymentMethods"
import ChangePassword from "./../../Components/Dashboard/ChangePassword"
import Wishlist from "./../../Components/Dashboard/Wishlist"
import useProfileAuthStore from "../../Zustand/profileAuthStore"
import { useTranslation } from "react-i18next"

function AccountLayout() {
  const { t, i18n } = useTranslation();
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

  // Get current language
  const currentLanguage = i18n.language;

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountInformation userData={userData} language={currentLanguage} />
      case "orders":
        return <OrdersSection orders={orders} language={currentLanguage} />
      case "payment":
        return <PaymentMethods language={currentLanguage} />
      case "password":
        return <ChangePassword language={currentLanguage} />
      case "wishlist":
        return (window.location.href = "/wishlist")
      default:
        return <AccountInformation language={currentLanguage} />
    }
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto px-4 sm:px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} language={currentLanguage} />

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-serif mb-8">{t('dashboard.title')}</h1>
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AccountLayout

