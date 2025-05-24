"use client"

import { useState } from "react"

const BillingForm = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    country: "United States",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    createAccount: false,
    sameAsShipping: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-xs font-medium">
          EMAIL ADDRESS<span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-xs font-medium">
            FIRST NAME<span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-xs font-medium">
            LAST NAME<span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="companyName" className="block text-xs font-medium">
          COMPANY NAME (OPTIONAL)
        </label>
        <input
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-xs font-medium">
          COUNTRY / REGION<span className="text-red-500">*</span>
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        >
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Australia">Australia</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
        </select>
      </div>

      <div>
        <label htmlFor="streetAddress1" className="block text-xs font-medium">
          STREET ADDRESS<span className="text-red-500">*</span>
        </label>
        <input
          id="streetAddress1"
          name="streetAddress1"
          placeholder="House number and street name"
          required
          value={formData.streetAddress1}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        />
      </div>

      <div>
        <input
          id="streetAddress2"
          name="streetAddress2"
          placeholder="Apartment, suite, unit, etc. (optional)"
          value={formData.streetAddress2}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-xs font-medium">
          TOWN / CITY<span className="text-red-500">*</span>
        </label>
        <input
          id="city"
          name="city"
          required
          value={formData.city}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="state" className="block text-xs font-medium">
            STATE<span className="text-red-500">*</span>
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="">Select a state</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="FL">Florida</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
            <option value="WA">Washington</option>
          </select>
        </div>
        <div>
          <label htmlFor="zipCode" className="block text-xs font-medium">
            ZIP CODE<span className="text-red-500">*</span>
          </label>
          <input
            id="zipCode"
            name="zipCode"
            required
            value={formData.zipCode}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-medium">
          PHONE<span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        />
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="sameAsShipping"
          name="sameAsShipping"
          checked={formData.sameAsShipping}
          onChange={handleChange}
          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
        />
        <label htmlFor="sameAsShipping" className="text-xs font-medium leading-tight">
          WOULD LIKE TO SIGN UP FOR THE MAILING LIST? (OPTIONAL)
        </label>
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="createAccount"
          name="createAccount"
          checked={formData.createAccount}
          onChange={handleChange}
          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
        />
        <label htmlFor="createAccount" className="text-xs font-medium leading-tight">
          Create an account?
        </label>
      </div>

      <div className="flex justify-between pt-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            PREVIOUS
          </button>
        )}
        <button
          type="submit"
          className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          NEXT
        </button>
      </div>
    </form>
  )
}

export default BillingForm
