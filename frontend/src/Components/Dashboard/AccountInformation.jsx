import useProfileAuthStore from "../../Zustand/profileAuthStore"
function AccountInformation( ) {
   const name = useProfileAuthStore((state) => state.name)
   const email = useProfileAuthStore((state) => state.email)
   const role = useProfileAuthStore((state) => state.role)

  return (
      <div>
        <section className="mb-12">
          <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">Primary address</h2>
          <div className="flex justify-between items-start">
            <div>
              <p className="mb-1">{name}</p>
              <p className="text-gray-600">Pakitan</p>
            </div>
            <button className="text-gray-700 hover:underline">Manage Address</button>
          </div>
        </section>
  
        <section className="mb-12">
          <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{email}</p>
              </div>
              <button className="text-gray-700 hover:underline">Edit</button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>12313</p>
              </div>
              <button className="text-gray-700 hover:underline">Edit</button>
            </div>
          </div>
        </section>
      </div>
    )
  }
  
  export default AccountInformation
  
  