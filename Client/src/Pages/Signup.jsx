import React, { useState } from 'react';
import NavBar from '../Components/NavBar';
import '../css/Signup.css';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer';
import { FaUserCircle } from 'react-icons/fa'; // Icon for the avatar
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux'; // Redux hook to dispatch actions
import { loginInUser } from '../Store/authSlice'; // Import the loginUser action from authSlice
import { signupUser } from '../util/queries'; // API function to handle signup
import { toast } from 'react-toastify'; // Import react-toastify
import { FaSpinner } from 'react-icons/fa'; // Import loader icon from react-icons
import SmallLoader from '../Components/Common/SmallLoader';

const Signup = () => {
  const [FormData, SetFormData] = useState({
    Fname: "",
    Lname: "",
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
  const dispatch = useDispatch(); // Redux dispatch

  // Handle form submission using mutation
  const { mutate, data, isLoading:loading, error: Error, isError, isSuccess } = useMutation({
    mutationFn: signupUser,
    onSuccess: (response) => {
      toast.success('Signup successful!');
      dispatch(loginInUser({ 'user': response.data.user, 'tokens': response.data.tokens }));
      // Show success toast and dispatch login
    },
    onError: (error) => {
      console.error("Error during signup:", error);
      toast.error(`Signup failed: ${error.response?.data?.error || 'Something went wrong'}`);
      // Show error toast
    },
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

    // Trigger mutation to submit form data
    mutate(FormData);
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
            <div style={{display:'flex',width:'100%',gap:'0.6rem'}}>

            <input type="text" name="Fname" onChange={FormDataHandler} placeholder='First Name' required />
            <input type="text" name="Lname" onChange={FormDataHandler} placeholder='Last Name' required />
            </div>
            <input type="email" name="Email" onChange={FormDataHandler} placeholder='Email' required />
            {Errors.EmailError && <div className="error">{Errors.EmailError}</div>}
            <input type="password" name="Password" onChange={FormDataHandler} placeholder='Password' required />
            {Errors.PasswordError && <div className="error">{Errors.PasswordError}</div>}
            
            {/* New Address input */}
            <input type="text" name="Address" onChange={FormDataHandler} placeholder='Address' required />

            {/* Submit button with loader and disabled during API call */}
            <button
              type="submit"
              disabled={loading}
              // style={{ backgroundColor: loading ? "initial" : "#3c3c3c" }}
              className="login-button"
            >
              {loading ? (
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <SmallLoader />
                </div>
              ) : (
                "signup"
              )}
            </button>
          </form>
          {/* {isLoading && <div>Loading...</div>} */}
          {isError && <div className="error">{Error.response?.data?.error || "Signup failed."}</div>}
          <div className="Signup-Right-Bottom">
            <div>Already have an Account? <Link to="/Login">Login</Link></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
