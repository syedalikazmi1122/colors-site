"use client"
import sendRequest from "./../../Utils/apirequest";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useState } from "react"

function ChangePassword({ language }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const currentPassword = e.target.currentPassword.value
    const newPassword = e.target.newPassword.value
    const confirmPassword = e.target.confirmPassword.value

    if (newPassword !== confirmPassword) {
      toast.error(t('dashboard.password.mismatch'))
      return
    }

    try {
      const response = await sendRequest("POST", "/change-password", {
        currentPassword,
        newPassword,
      })

      if (response.status === 200) {
        toast.success(t('dashboard.password.success'))
      } else {
        toast.error(t('dashboard.password.failed'))
      }
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error(t('dashboard.password.error'))
    }
  }

  return (
    <div>
      <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">{t('dashboard.password.title')}</h2>

      <form onSubmit={handleSubmit} className="py-6 space-y-4 max-w-md">
        <div>
          <label htmlFor="currentPassword" className="block text-sm text-gray-600 mb-1">
            {t('dashboard.password.current')}
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm text-gray-600 mb-1">
            {t('dashboard.password.new')}
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1">
            {t('dashboard.password.confirm')}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors"
        >
          {t('dashboard.password.update')}
        </button>
      </form>
    </div>
  )
}

export default ChangePassword

