import React, { useEffect } from 'react'
import Header from '../Components/Home/Header'
import '../css/Home.css'
import Website_info from '../Components/Website_info'
import Product_cotegory from '../Components/Home/Product_cotegory'
import Footer from '../Components/Footer'
import ProductList from '../Components/Home/ProductList'
import { getFeaturedProduct } from '../util/queries'
import Loader from '../Components/Common/Loader'
import { useQuery } from '@tanstack/react-query'

const Home = () => {
  const { data, isLoading, error, isFetching, isSuccess } = useQuery({
    queryKey: [
      "productsFeatures"
    ],
    queryFn: getFeaturedProduct,
    keepPreviousData: true, 
  });
  useEffect(() => {
    document.title = "Home"; 
  }, [])

  return (
    <>
    <Header/>
    <Product_cotegory/>
    {
      isLoading ? <Loader/>:
      <ProductList products={data}/>
    }
    <Website_info/>
    <Footer/>
    </>
  )
}

export default Home