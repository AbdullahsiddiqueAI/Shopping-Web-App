import React, { useEffect } from 'react';
import Home from './Pages/Home';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import MyAccount from './Pages/MyAccount';
import Myprofile from './Components/Myaccount/Myprofile';
import Mypaymentoptions from './Components/Myaccount/Mypaymentoptions';
import Myaddress from './Components/Myaccount/Myaddress';
import Mycancellation from './Components/Myaccount/Mycancellation';
import Footer from './Components/Footer';
import Products from './Pages/Products';
import PaymentForm from './Pages/PaymentForm';
import ProductPage from './Pages/ProductPage';
import Cart from './Pages/Cart';
import NotFound from './Pages/NotFound';
import Contact from './Pages/Contact';
import OrderTable from './Components/Myaccount/OrderTable';
import PrivateRoute from './Components/PrivateRoute';
import AuthRoute from './Components/AuthRoute';
import { useQuery } from '@tanstack/react-query';
import { getCartData } from './util/queries';
import { setCartData } from './Store/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import PayementPage from './Pages/PayementPage';

function App() {
  const dispatch = useDispatch(); 
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Fetch cart data when the user is authenticated
  const { data: cartData, isLoading, error, isSuccess } = useQuery({
    queryKey: ['cartData'],
    queryFn: getCartData,
    enabled: isAuthenticated, // Only fetch cart data when authenticated
    onSuccess: (data) => {
      console.log("Cart Data Loaded", data);
    }
  });

  // Dispatch cart data to Redux store on successful fetch
  useEffect(() => {
    if (isSuccess && cartData) {
      const formattedCartData = cartData.map(item => ({
        id: item.product.product_id,
        name: item.product.name,
        price: item.product.price,
        productPic: item.product.productPic,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity
      }));

      // Dispatch the formatted cart data to the Redux store
      dispatch(setCartData(formattedCartData));
    }
  }, [isSuccess, cartData, dispatch]);



  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<PrivateRoute component={Cart} />} />
        <Route path="/payment" element={<PrivateRoute component={PayementPage} />} />
        <Route path="/ProductPage/:id" element={<ProductPage />} />
        <Route path="/Signup" element={<AuthRoute component={Signup} />} />
        <Route path="/Login" element={<AuthRoute component={Login} />} />
        <Route path="/Products" element={<Products />} />
        {/* <Route path="/Products/:search" element={<Products />} /> */}

        {/* Protect MyAccount and its sub-routes */}
        <Route path="/Myaccount" element={<PrivateRoute component={MyAccount} />}>
          <Route path="" element={<PrivateRoute component={Myprofile} />} />
          <Route path="Mypayment" element={<PrivateRoute component={Mypaymentoptions} />} />
          <Route path="Myaddress" element={<PrivateRoute component={Myaddress} />} />
          <Route path="Myorders" element={<PrivateRoute component={OrderTable} />} />
          <Route path="Mycancellations" element={<PrivateRoute component={Mycancellation} />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
