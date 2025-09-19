
import './App.css'
import {  Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Tiket from './Tiket.jsx'
import TypeOfBuss from './TypeOfBuss.jsx'
import AvailableSpots from './AvailableSpote.jsx'
import Cashier from './Admin/Casher.jsx'
import Head from './Admin/Head.jsx'
import SendData from './SendData.jsx'
import { BookingProvider } from './BookingContext';
import Refund from './Admin/Refund.jsx';
function App() {

  return (
      <BookingProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ticket" element={<Tiket />} />
        <Route path='/typeOfBuss' element={<TypeOfBuss/>}/>
        <Route path='/AvailableSpots' element={<AvailableSpots/>}/>
        <Route path='/cashier' element={<Cashier />} />
        <Route path='/admin' element={<Head />} />
        <Route path="/send" element={<SendData />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      </BookingProvider>
      
 
  );
}

export default App;
