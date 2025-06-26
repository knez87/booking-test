"use client"

import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function HelpPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Help Center</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How do I cancel my booking?</h3>
                <p className="text-gray-600">
                  You can cancel your booking by going to your booking confirmation page and clicking the "Cancel
                  Booking" button. Cancellation policies vary by venue, so please check the venue's specific policy
                  before booking.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Can I modify my booking after confirmation?</h3>
                <p className="text-gray-600">
                  Yes, you can modify your booking by contacting our customer service team or the venue directly. Please
                  note that changes are subject to availability and may incur additional charges.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How do I pay for my booking?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards and PayPal. Payment is processed securely at the time of booking
                  confirmation. Some venues may also offer the option to pay on arrival.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Support</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                Our customer support team is available Monday to Friday, 9am to 6pm (GMT).
              </p>
              <div className="space-y-2">
                <p className="text-gray-800">
                  <span className="font-medium">Email:</span> support@meetingbooker.com
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Phone:</span> +1 (555) 123-4567
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Tips</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Book early to secure your preferred venue and time slot</li>
              <li>Consider the number of delegates and required amenities when selecting a room</li>
              <li>Check the venue's location and accessibility options</li>
              <li>Review the cancellation policy before confirming your booking</li>
              <li>Add any required catering or equipment when making your booking</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
