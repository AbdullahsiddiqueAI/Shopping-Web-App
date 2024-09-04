import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css'; // Assuming your CSS is in this file
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const NotFound = () => {
  return (
    <>
    <NavBar/>
    <div className="not-found-container">
      <div className="not-found-breadcrumb">
        Home / 404 Error
      </div>
      <h1 className="not-found-title">404 Not Found</h1>
      <p className="not-found-message">
        Your visited page not found. You may go home page.
      </p>
      <Link to="/" className="not-found-button">
        Back to home page
      </Link>
    </div>
    <Footer/>
    </>
  );
}

export default NotFound;
