import { Check } from "lucide-react"

const CheckoutSteps = ({
  currentStep,
  steps = [
    { id: "cart", label: "CART" },
    { id: "billing", label: "BILLING" },
    { id: "shipping", label: "SHIPPING" },
    { id: "payment", label: "PAYMENT" },
  ],
}) => {
  // Find the index of the current step
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="relative">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          // Determine if this step is active, completed, or upcoming
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex
          const isUpcoming = index > currentIndex

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2
                  ${isActive ? "border-gray-900 bg-white text-gray-900" : ""}
                  ${isCompleted ? "border-gray-900 bg-gray-900 text-white" : ""}
                  ${isUpcoming ? "border-gray-300 bg-white text-gray-300" : ""}
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-sm">{index + 1}</span>}
              </div>
              <div
                className={`
                  mt-2 text-xs font-medium
                  ${isActive ? "text-gray-900" : ""}
                  ${isCompleted ? "text-gray-900" : ""}
                  ${isUpcoming ? "text-gray-400" : ""}
                `}
              >
                {step.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress line */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0">
        <div
          className="h-full bg-gray-900 transition-all duration-300"
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}

export default CheckoutSteps
