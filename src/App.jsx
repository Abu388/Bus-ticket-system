import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Tiket from './Tiket.jsx'
import TypeOfBuss from './TypeOfBuss.jsx'
import AvailableSpots from './AvailableSpote.jsx'
import Cashier from './Admin/Casher.jsx'
import Head from './Admin/Head.jsx'
import SendData from './SendData.jsx'
import { BookingProvider } from './BookingContext';
import Refund from './Admin/Refund.jsx';
import { Header } from './Header/Header.jsx'
import Naveigator from './Header/Naveigator.jsx';
import RoundTrip from './ways/Round-trip'
import MultiCity from './ways/Multi-city.jsx';
import ManageBooking from './ManageBooking/ManageBooking'
import Supervisor from './Admin/Supervisor.jsx';
import {RefundProvider} from './Context/RefundContext.jsx';
import TravelBooking from './ManageBooking/TravelBooking'


function App() {
  return (
    <BookingProvider>
      <RefundProvider>
        <div className="min-h-screen">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ticket" element={<Tiket />} />
              <Route path='/typeOfBuss' element={<TypeOfBuss/>}/>
              <Route path='/AvailableSpots' element={<AvailableSpots/>}/>
              <Route path='/cashier' element={<Cashier />} />
              <Route path='/admin' element={<Head />} />
              <Route path="/send" element={<SendData />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/Naveigator" element={<Naveigator />} />
              <Route path="/round-trip" element={<RoundTrip />} />
              <Route path="/multi-city" element={<MultiCity />} />
              <Route path="/manage-booking" element={<ManageBooking />} />
              <Route path="/supervisor" element={<Supervisor />} />
              <Route path="/travel-booking" element={<TravelBooking />} />
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
          </main>
        </div>
      </RefundProvider>
    </BookingProvider>
  );
}

export default App;