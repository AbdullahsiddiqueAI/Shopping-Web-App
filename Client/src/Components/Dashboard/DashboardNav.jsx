import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa6";
import { FaBars } from 'react-icons/fa';


const DashboardNav = ({toggleMenu}) => {
  const navigate =useNavigate()
  return (
    <div className='DashboardNav-container'>

        <div className="res-hamburger" onClick={toggleMenu} style={{marginLeft:'10px'}}>
        <FaBars className="res-hamburger-icon" />
      </div>
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
