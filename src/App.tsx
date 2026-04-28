import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { FloatingBookingButton } from './components/booking/FloatingBookingButton'

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })))
const Booking = lazy(() => import('./pages/Booking').then(module => ({ default: module.Booking })))
const BookingSimple = lazy(() => import('./pages/BookingSimple').then(module => ({ default: module.BookingSimple })))
const Consent = lazy(() => import('./pages/Consent').then(module => ({ default: module.Consent })))

// Simple elegant loader for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
)

function App() {
  return (
    <>
      <div className="static-grain pointer-events-none" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-simple" element={<BookingSimple />} />
          <Route path="/consent" element={<Consent />} />
        </Routes>
      </Suspense>
      <FloatingBookingButton />
    </>
  )
}

export default App
