import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'; // Importing useSelector to access auth state
import NavBar from '../Components/NavBar';
import { Link, Outlet } from 'react-router-dom';
import '../css/Myaccount.css';
import Footer from '../Components/Footer';

const MyAccount = () => {
    // Fetch user data from Redux store or fallback to localStorage
    const user = useSelector((state) => state.auth.user); // Accessing user info from auth state
    useEffect(() => {
        document.title = "Account | Profile"; // Change this title as needed
      }, [])

    // Fallback to localStorage if the Redux store doesn't have the data
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};

    const userInfo = user || storedUser; // Use Redux user if available, else fallback to localStorage

    // Construct user's full name
    const fullName = `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim() || "User";

    return (
        <>
            <NavBar />
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <div className="Myaccount-main">
                    <div className="Myaccount-navigate">
                        <div> 
                            <Link to='/'>Home /</Link> 
                            <Link to='/Myaccount'>MyAccount</Link>
                        </div>
                        <div>Welcome, {fullName || userInfo.email}!</div>
                    </div>
                    <div className="Myaccount-container">
                        <div className="MyAccount-nav">
                            <div className="Myaccount-top">
                                <div className='Myaccount-text-head'>Manage My Account</div>
                                <ul>
                                    <li>
                                        <Link to="/Myaccount/">My Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/Myaccount/Myaddress">My Address</Link>
                                    </li>
                                    <li>
                                        <Link to="/Myaccount/Mypayment">My Payment Options</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="Myaccount-bottom">
                                <div className='Myaccount-text-head'>Orders</div>
                                <ul>
                                    <li>
                                        <Link to="/Myaccount/Myorders">My Orders</Link>
                                    </li>
                                    <li>
                                        <Link to="/Myaccount/Mycancellations">My Cancellations</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="MyAccount-content">
                            <Outlet />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default MyAccount;
