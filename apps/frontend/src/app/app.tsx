import { Routes, Route } from "react-router-dom"
import { BookingProvider } from "./contexts/BookingContext"
import { Layout } from "./components/Layout"
import { SearchPage } from "./pages/SearchPage"
import { VenueDetailsPage } from "./pages/VenueDetailsPage"
import { BookingPage } from "./pages/BookingPage"
import { ConfirmationPage } from "./pages/ConfirmationPage"

export function App() {
  return (
    <BookingProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/venue/:id" element={<VenueDetailsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
        </Routes>
      </Layout>
    </BookingProvider>
  )
}

export default App
