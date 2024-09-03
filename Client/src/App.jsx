import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import MyAccount from './Pages/MyAccount'
import Myprofile from './Components/Myaccount/Myprofile'
import Mypaymentoptions from './Components/Myaccount/Mypaymentoptions'
import Myaddress from './Components/Myaccount/Myaddress'
import Myorders from './Components/Myaccount/Myorders'
import Mycancellation from './Components/Myaccount/Mycancellation'
import Footer from './Components/Footer'
import Products from './Pages/Products'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Products" element={<Products/>} />
        <Route path="/Myaccount" element={<MyAccount />}>
          <Route path="" element={<Myprofile />} />
          <Route path="Mypayment" element={<Mypaymentoptions />} />
          <Route path="Myaddress" element={<Myaddress />} />
          <Route path="Myorders" element={<Myorders />} />
          <Route path="Mycancellations" element={<Mycancellation />} />
        </Route>

      </Routes>
    
    </>
  )
}

export default App
