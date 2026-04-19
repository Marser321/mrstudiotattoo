import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Booking } from './pages/Booking'
import { BookingSimple } from './pages/BookingSimple'
import { FloatingBookingButton } from './components/booking/FloatingBookingButton'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking-simple" element={<BookingSimple />} />
      </Routes>
      <FloatingBookingButton />
    </>
  )
}


export default App
