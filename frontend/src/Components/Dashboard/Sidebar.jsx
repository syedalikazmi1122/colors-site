"use client"

function AccountSidebar({ navItems, activeTab, setActiveTab }) {
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
                onClick={() => setActiveTab(item.id)}
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

