"use client"

import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { useBooking } from "../contexts/BookingContext"
import { Menu, X, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { steps, state } = useBooking()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header
        className={`sticky top-0 z-40 bg-white border-b transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MB</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">MeetingBooker</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`text-gray-600 hover:text-gray-900 transition-colors ${
                  location.pathname === "/" ? "text-blue-600 font-medium" : ""
                }`}
              >
                Search
              </Link>
              <Link
                to="/help"
                className={`text-gray-600 hover:text-gray-900 transition-colors ${
                  location.pathname === "/help" ? "text-blue-600 font-medium" : ""
                }`}
              >
                Help
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md ${
                  location.pathname === "/"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Search
              </Link>
              <Link
                to="/help"
                className={`block px-3 py-2 rounded-md ${
                  location.pathname === "/help"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Help
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Progress Steps - Show only during booking flow */}
      {location.pathname !== "/" && location.pathname !== "/help" && (
        <div className="bg-white border-b sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="hidden md:flex items-center justify-between">
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

            {/* Mobile progress indicator */}
            <div className="md:hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${"bg-blue-600 text-white"}`}
                  >
                    {state.currentStep}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {steps.find((s) => s.step === state.currentStep)?.title}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Step {state.currentStep} of {steps.length}
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(state.currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs - Show on inner pages */}
      {location.pathname !== "/" && location.pathname !== "/help" && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-700">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              {location.pathname.startsWith("/venue/") && (
                <>
                  <span className="text-gray-700">Venue Details</span>
                </>
              )}
              {location.pathname === "/booking" && (
                <>
                  <Link to={`/venue/${state.selectedVenue?.id}`} className="hover:text-gray-700">
                    Venue Details
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-gray-700">Booking</span>
                </>
              )}
              {location.pathname.startsWith("/confirmation/") && (
                <>
                  <Link to={`/venue/${state.selectedVenue?.id}`} className="hover:text-gray-700">
                    Venue Details
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link to="/booking" className="hover:text-gray-700">
                    Booking
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-gray-700">Confirmation</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="min-h-[calc(100vh-16rem)]">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">About</h3>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MB</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">MeetingBooker</span>
              </div>
              <p className="text-gray-600 text-sm">
                The easiest way to find and book meeting rooms and event spaces worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                    Search Venues
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-gray-600 hover:text-gray-900 text-sm">
                    Help Center
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Email: support@meetingbooker.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Booking Street, City, Country</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 mt-6 text-center text-sm text-gray-500">
            <p>&copy; 2024 MeetingBooker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
