import React, { useState } from 'react'
import { NavLink, Link } from "react-router-dom";
import superStoreImage from '../css/img/SuperStore.png';
import {useSelector,useDispatch} from 'react-redux';
import { openDrawer } from '../Store/drawerSlice';
import Drawer from './Common/Drawer';


const NavBar = () => {
    const [Toggle,setToggle]=useState(false);
    const toggle=()=>{
        setToggle(!Toggle)
    }
    const isOpen = useSelector(state => state.drawer.isOpen);
    const dispatch = useDispatch();
    return (
        <>
        <Drawer/>
            <div className="sidebar" style={{display:Toggle?'flex':'none'}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{color:"white"}}>Search</div>
            <div className="hamburger-menu" onClick={toggle} style={{fontSize:'2.4rem' ,color:'white'}}>
                    ×
                </div> 
                </div>
                <div className="nav-search-sm"><input type="text" name='search' placeholder='Search The Store'  style={{backgroundColor:'white',boxShadow:'none',border:'none'}}/><div className="search-icon"></div></div>
                <div className="MyAccount-nav-hanburger">
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
                </div>
        <nav>
            <div className="nav-top">
                <div className="hamburger-menu" onClick={toggle}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    {/* × */}
                </div>

                <Link to='/' className='website-img'>   </Link>
                <div className="nav-search"><input type="text" name='search' placeholder='Search The Store' style={{backgroundColor:'white',boxShadow:'none',border:'none'}}/><div className="search-icon"></div></div>
                <div className="nav-top-left">
                    <div className="nav-cart" onClick={()=>dispatch(openDrawer())}>
                        <div className="cart-icon"></div>
                        <div className="cart-text-part">
                            <div className="cart-text-count">0</div>
                            <div className="cart-text">Cart</div>
                        </div>
                    </div>
                    <Link to='/Myaccount'>
                        <div className="nav-account">
                            <div className="account-icon"></div>
                            <div className="account-text-part">
                                <div className="account-text">Login or Register</div>
                                <div style={{ fontWeight: 600, fontSize: "0.8rem" }} className="account-text1" >My Acoount</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="nav-bottom">
                <ul>
                    <li><NavLink to="/">Home</NavLink> </li>
                    {/* <li><NavLink to="/Abouts">Abouts</NavLink> </li> */}
                    <li><NavLink to="/Login">Login</NavLink> </li>
                    <li><NavLink to="/Signup">Signup</NavLink></li>
                    <li><NavLink to="/Products">Products</NavLink></li>
                    <li><NavLink to="/Contact">Contact</NavLink></li>
                    <li><NavLink to="/dsfdsf">Not Found</NavLink></li>
                </ul>
            </div>
        </nav>
        </>
    )
}

export default NavBar