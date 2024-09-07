import React from 'react'
import Header from '../Components/Home/Header'
import '../css/Home.css'
import Website_info from '../Components/Website_info'
import Product_cotegory from '../Components/Home/Product_cotegory'
import Footer from '../Components/Footer'
import ProductList from '../Components/Home/ProductList'

const Home = () => {
  return (
    <>
    <Header/>
    <Product_cotegory/>
    {/* <ProductList/> */}
    <Website_info/>
    <Footer/>
    </>
  )
}

export default Home