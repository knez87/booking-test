import { Routes, Route, useLocation } from "react-router-dom"
import { BookingProvider } from "./contexts/BookingContext"
import { Layout } from "./components/Layout"
import { SearchPage } from "./pages/SearchPage"
import { VenueDetailsPage } from "./pages/VenueDetailsPage"
import { BookingPage } from "./pages/BookingPage"
import { ConfirmationPage } from "./pages/ConfirmationPage"
import { PageTransition } from "./components/PageTransition"
import { GlobalLoadingIndicator } from "./components/GlobalLoadingIndicator"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { Suspense, lazy } from "react"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
})

// Lazy load pages for better performance
const LazyHelpPage = lazy(() => import("./pages/HelpPage"))

export function App() {
  const location = useLocation()

  return (
    <QueryClientProvider client={queryClient}>
      <BookingProvider>
        <GlobalLoadingIndicator />
        <Layout>
          <PageTransition>
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <Routes location={location}>
                <Route path="/" element={<SearchPage />} />
                <Route path="/venue/:id" element={<VenueDetailsPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
                <Route path="/help" element={<LazyHelpPage />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </Layout>
      </BookingProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
