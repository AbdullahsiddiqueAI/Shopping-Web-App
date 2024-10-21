import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa6";


const DashboardNav = () => {
  const navigate =useNavigate()
  return (
    <div className='DashboardNav-container'>
      <Link to="/" className="website-img"></Link>
      <button className="DashboardNav-GotoShop-btn" onClick={()=>navigate('/')}>Go to Shop
        <span>
        <FaArrowRight/>
          </span>
      </button>
    </div>
  )
}

export default DashboardNav
