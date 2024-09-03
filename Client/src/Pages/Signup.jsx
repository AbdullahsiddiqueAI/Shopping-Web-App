import React, { useState } from 'react';
import NavBar from '../Components/NavBar';
import '../css/Signup.css';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer';

const Signup = () => {
  const [FormData, SetFormData] = useState({
    Name: "",
    Email: "",
    Password: ""
  });

  const [Errors, SetErrors] = useState({

    EmailError: "",
    PasswordError: ""
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[@$!%*?&]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  const FormDataHandler = (e) => {
    SetFormData({ ...FormData, [e.target.name]: e.target.value });

    if (e.target.name === 'Password') {
      SetErrors({ ...Errors, PasswordError: '' });
    }
    if (e.target.name === 'Email') {
      SetErrors({ ...Errors, EmailError: '' });
    }
  };

  const FormSubmit = (e) => {
    e.preventDefault();
    const emailValid = validateEmail(FormData.Email);
    const passwordError = validatePassword(FormData.Password);

    if (!emailValid || passwordError) {
      SetErrors({
        EmailError: emailValid ? "" : "Please enter a valid email.",
        PasswordError: passwordError
      });
      return;
    }

    // Handle form submission
    console.log("Form submitted", FormData);
  };

  return (
    <>
      <NavBar />
      <div className="Signup-Container">
        <div className="Signup-Left-Part">
          <div className="Signup-img"></div>
        </div>
        <div className="Signup-Right-Part">
          <div className="Signup-text">
            <div className="Signup-text-head">Create an Account</div>
            <div className="Signup-text-para">Enter Your Details Below</div>
          </div>
          <form onSubmit={FormSubmit}>
            <input type="text" name="Name" onChange={FormDataHandler} placeholder='Full Name' required />
            <input type="email" name="Email" onChange={FormDataHandler} placeholder='Email' required />
            {Errors.EmailError && <div className="error">{Errors.EmailError}</div>}
            <input type="password" name="Password" onChange={FormDataHandler} placeholder='Password' required />
            {Errors.PasswordError && <div className="error">{Errors.PasswordError}</div>}
            <input type="submit" value="Signup" />
          </form>
          <div className="Signup-Right-Bottom">
            <div>Already have an Account? <Link to="/Login">Login</Link></div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Signup;
