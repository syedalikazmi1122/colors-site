"use client"
import sendRequest from "./../../Utils/apirequest";

function ChangePassword() {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const currentPassword = e.target.currentPassword.value
    const newPassword = e.target.newPassword.value
    const confirmPassword = e.target.confirmPassword.value

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match")
      return
    }

    try {
      const response = await sendRequest("POST", "/change-password", {
        currentPassword,
        newPassword,
      })

      if (response.status === 200) {
        alert("Password changed successfully")
      } else {
        alert("Failed to change password")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      alert("An error occurred while changing your password")
    }
  }

  return (
    <div>
      <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">Change Password</h2>

      <form onSubmit={handleSubmit} className="py-6 space-y-4 max-w-md">
        <div>
          <label htmlFor="currentPassword" className="block text-sm text-gray-600 mb-1">
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            className="w-full p-2 border border-gray-300 rounded-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm text-gray-600 mb-1">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            className="w-full p-2 border border-gray-300 rounded-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="w-full p-2 border border-gray-300 rounded-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors"
        >
          Update Password
        </button>
      </form>
    </div>
  )
}

export default ChangePassword

