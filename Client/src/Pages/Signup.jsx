import React, { useState } from 'react';
import NavBar from '../Components/NavBar';
import '../css/Signup.css';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer';
import { FaUserCircle } from 'react-icons/fa'; // Icon for the avatar

const Signup = () => {
  const [FormData, SetFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    Address: "", // New Address field
    Picture: null // New Picture field
  });

  const [Errors, SetErrors] = useState({
    EmailError: "",
    PasswordError: ""
  });

  const [PreviewImage, SetPreviewImage] = useState(null); // For displaying the uploaded image preview

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
    const { name, value, files } = e.target;

    if (name === "Picture") {
      const file = files[0];
      SetFormData({ ...FormData, Picture: file });
      SetPreviewImage(URL.createObjectURL(file)); // Preview the uploaded image
    } else {
      SetFormData({ ...FormData, [name]: value });
    }

    if (name === 'Password') {
      SetErrors({ ...Errors, PasswordError: '' });
    }
    if (name === 'Email') {
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

    // Handle form submission (including uploaded picture and address)
    console.log("Form submitted", FormData);
  };

  const handleAvatarClick = () => {
    document.getElementById('PictureInput').click(); // Trigger file input click
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
            {/* Avatar icon and image upload */}
            <div className="avatar-upload" onClick={handleAvatarClick}>
              {PreviewImage ? (
                <img src={PreviewImage} alt="Avatar" className="avatar-preview" />
              ) : (
                <FaUserCircle size={100} className="default-avatar" />
              )}
              <input
                type="file"
                id="PictureInput"
                name="Picture"
                onChange={FormDataHandler}
                accept="image/*"
                style={{ display: 'none' }} // Hide the file input
              />
            </div>
            <input type="text" name="Name" onChange={FormDataHandler} placeholder='Full Name' required />
            <input type="email" name="Email" onChange={FormDataHandler} placeholder='Email' required />
            {Errors.EmailError && <div className="error">{Errors.EmailError}</div>}
            <input type="password" name="Password" onChange={FormDataHandler} placeholder='Password' required />
            {Errors.PasswordError && <div className="error">{Errors.PasswordError}</div>}
            
            {/* New Address input */}
            <input type="text" name="Address" onChange={FormDataHandler} placeholder='Address' required />

            <input type="submit" value="Signup" />
          </form>
          <div className="Signup-Right-Bottom">
            <div>Already have an Account? <Link to="/Login">Login</Link></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Signup;
