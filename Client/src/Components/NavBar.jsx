import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { openDrawer } from '../Store/drawerSlice';
import { logoutUser } from '../Store/authSlice';  // Import the logout action
import Drawer from './Common/Drawer';
import { MdLogout } from 'react-icons/md';  // Importing the logout icon from react-icons
import { toast } from 'react-toastify';
import { setSearchQuery } from '../Store/searchSlice';  // Import setSearchQuery from Redux

const NavBar = () => {
  const { isAuthenticated, user,isAdmin } = useSelector((state) => state.auth); // Get authentication status and user data
  const { totalQuantity } = useSelector((state) => state.cart); // Get cart data
  const dispatch = useDispatch();
  const [Toggle, setToggle] = useState(false);
  const [searchInput, setSearchInput] = useState(useSelector((state) => state.search.searchQuery));  // Initialize local state for search input
  const navigate = useNavigate();
  const handleSearchSubmit = (e) => {
    // e.preventDefault(); // Prevent the form from submitting in the traditional way
    
      dispatch(setSearchQuery(searchInput));  // Dispatch search query to Redux store
      navigate('/Products/')  
    
  };

  const toggle = () => {
    setToggle(!Toggle);
  };

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch the logout action
    toast.success("You have been logged out!");
  };

  return (
    <>
      <Drawer />
      <div className="sidebar" style={{ display: Toggle ? 'flex' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ color: "white" }}>Search</div>
          <div className="hamburger-menu" onClick={toggle} style={{ fontSize: '2.4rem', color: 'white' }}>
            ×
          </div>
        </div>
        <div className="nav-search-sm">
          <input
            type="text"
            name="search"
            placeholder="Search The Store"
            style={{ backgroundColor: 'white', boxShadow: 'none', border: 'none' }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}  // Update local state
          />
          <div className="search-icon" onClick={handleSearchSubmit}></div>
        </div>
        {isAuthenticated ? (
          <div className="MyAccount-nav-hanburger">
            <div className="Myaccount-top">
              <div className="Myaccount-text-head">Manage My Account</div>
              <ul>
                <li><Link to="/Myaccount/" onClick={toggle}>My Profile</Link></li>
                <li><Link to="/Myaccount/Myaddress" onClick={toggle}>My Address</Link></li>
                <li><Link to="/Myaccount/Mypayment" onClick={toggle}>My Payment Options</Link></li>
              </ul>
            </div>
            <div className="Myaccount-bottom">
              <div className="Myaccount-text-head">Orders</div>
              <ul>
                <li><Link to="/Myaccount/Myorders" onClick={toggle}>My Orders</Link></li>
                <li><Link to="/Myaccount/Mycancellations" onClick={toggle}>My Cancellations</Link></li>
              </ul>
            </div>
          </div>
        ) : ""}
      </div>

      <nav>
        <div className="nav-top">
          <div className="hamburger-menu" onClick={toggle}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>

          <Link to="/" className="website-img"></Link>
          <div className="nav-search">
            {/* <form onSubmit={}> Wrap input in form for search submission */}
              <input
                type="text"
                name="search"
                placeholder="Search The Store"
                style={{ backgroundColor: 'white', boxShadow: 'none', border: 'none' }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}  // Update local state
              />
              <div type="submit" className="search-icon" onClick={handleSearchSubmit}></div>
            {/* </form> */}
          </div>

          <div className="nav-top-left">
            <div className="nav-cart" onClick={() => dispatch(openDrawer())}>
              <div className="cart-icon"></div>
              <div className="cart-text-part">
                <div className="cart-text-count">{totalQuantity}</div>
                <div className="cart-text">Cart</div>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="nav-account">
                <Link to="/Myaccount">
                  {user?.profilePhoto ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_END_POINT_image}${user.profilePhoto}`}
                      alt="User Profile"
                      className="avatar-preview"
                      style={{ width: '40px', height: '40px', marginBottom: '0px', marginLeft: '5px' }}
                    />
                  ) : (
                    <div className="account-icon"></div>
                  )}
                </Link>
                <div className="account-text-part">
                <div className="account-text">{isAdmin ? user?.first_name +` (Admin)`  || 'Admin' :user?.first_name || 'My Account'}</div>
                </div>

                <MdLogout
                  onClick={handleLogout}
                  style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '24px' }}
                  title="Logout"
                  className="logout-icon"
                />
                <button onClick={handleLogout} className="logout-button" style={{ marginLeft: '10px' }}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/Login">
                <div className="nav-account">
                  <div className="account-icon"></div>
                  <div className="account-text-part">
                    <div className="account-text">Login or Register</div>
                    <div style={{ fontWeight: 600, fontSize: "0.8rem" }} className="account-text1">My Account</div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="nav-bottom">
          <ul>
            {isAuthenticated && isAdmin && <li><NavLink to="/Dashboard">Dashboard</NavLink></li>}
            <li><NavLink to="/">Home</NavLink></li>
            {!isAuthenticated && <li><NavLink to="/Login">Login</NavLink></li>}
            {!isAuthenticated && <li><NavLink to="/Signup">Signup</NavLink></li>}
         
            <li><NavLink to="/Products">Products</NavLink></li>
            <li><NavLink to="/Contact">Contact</NavLink></li>
            <li><NavLink to="/dsfdsf">Not Found</NavLink></li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
