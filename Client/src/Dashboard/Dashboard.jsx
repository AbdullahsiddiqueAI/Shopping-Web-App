import React, { useEffect, useState } from 'react'
import DashboardNav from '../Components/Dashboard/DashboardNav'
import "../css/Dashboard/DasboardHome.css"
import DashboardLeftNav from '../Components/Dashboard/DashboardLeftNav'
import { Outlet } from 'react-router'
import DashboardNavLeftResponsive from '../Components/Dashboard/DashboardNavLeftResponsive'

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    document.title = "Dashboard"; 
  }, [])
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); 
  };
  return (
    <div className='Dashboard-container'>
     <div className="Dashboard-nav">
      <DashboardNav toggleMenu={toggleMenu}/>
     </div>
     <div className="dashboard-content">
        <div className={`res-dasboard-leftnav ${isMenuOpen ? 'open' : 'Displaynone'}`}> <DashboardNavLeftResponsive isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}/></div>
        <div className={`dasboard-leftnav `}> <DashboardLeftNav/> </div>
        <div className="dashboard-maincontent">
        <Outlet />
        </div>
     </div>
    </div>
  )
}

export default Dashboard
