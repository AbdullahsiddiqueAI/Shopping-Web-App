import React from 'react'
import DashboardNav from '../Components/Dashboard/DashboardNav'
import "../css/Dashboard/DasboardHome.css"
import DashboardLeftNav from '../Components/Dashboard/DashboardLeftNav'
import { Outlet } from 'react-router'

const Dashboard = () => {
  return (
    <div className='Dashboard-container'>
     <div className="Dashboard-nav">
      <DashboardNav/>
     </div>
     <div className="dashboard-content">
        <div className="dasboard-leftnav"> <DashboardLeftNav/> </div>
        <div className="dashboard-maincontent">
        <Outlet />
        </div>
     </div>
    </div>
  )
}

export default Dashboard
