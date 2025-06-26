import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { useBooking } from "../contexts/BookingContext"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { steps, state } = useBooking()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MB</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">MeetingBooker</span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Search
              </Link>
              <Link to="/help" className="text-gray-600 hover:text-gray-900">
                Help
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Progress Steps - Show only during booking flow */}
      {location.pathname !== "/" && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      step.step < state.currentStep
                        ? "bg-green-500 text-white"
                        : step.step === state.currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.step < state.currentStep ? "✓" : step.step}
                  </div>
                  <span
                    className={`ml-2 text-sm ${step.step <= state.currentStep ? "text-gray-900" : "text-gray-500"}`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-4 ${step.step < state.currentStep ? "bg-green-500" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 MeetingBooker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
