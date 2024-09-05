import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import MyAccount from './Pages/MyAccount'
import Myprofile from './Components/Myaccount/Myprofile'
import Mypaymentoptions from './Components/Myaccount/Mypaymentoptions'
import Myaddress from './Components/Myaccount/Myaddress'
// import Myorders from './Components/Myaccount/OrderTable'
import Mycancellation from './Components/Myaccount/Mycancellation'
import Footer from './Components/Footer'
import Products from './Pages/Products'
import PaymentForm from './Pages/PaymentForm'
import ProductPage from './Pages/ProductPage'
import Cart from './Pages/Cart'
import NotFound from './Pages/NotFound'
import Contact from './Pages/Contact'
import OrderTable from './Components/Myaccount/OrderTable'
function App() {

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<PaymentForm />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/ProductPage/:id" element={<ProductPage/>} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Products" element={<Products/>} />
        <Route path="/Myaccount" element={<MyAccount />}>
          <Route path="" element={<Myprofile />} />
          <Route path="Mypayment" element={<Mypaymentoptions />} />
          <Route path="Myaddress" element={<Myaddress />} />
          <Route path="Myorders" element={<OrderTable />} />
          <Route path="Mycancellations" element={<Mycancellation />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/Contact" element={<Contact />} />

      </Routes>
    
    </>
  )
}

export default App
