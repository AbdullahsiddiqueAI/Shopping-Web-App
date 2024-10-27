import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import "../css/Login.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginInUser } from "../Store/authSlice";
import { loginUser } from "../util/queries"; // API function to handle login
import Footer from "../Components/Footer";
import { FaSpinner } from "react-icons/fa"; // Import loader icon from react-icons
import { Link } from "react-router-dom";
import SmallLoader from "../Components/Common/SmallLoader";

const Login = () => {
  const [FormData, SetFormData] = useState({
    Email: "",
    Password: "",
  });


  const [loading, setLoading] = useState(false); // Manage loading state manually

  const dispatch = useDispatch(); // Redux dispatch

 



  const FormDataHandler = (e) => {
    SetFormData({ ...FormData, [e.target.name]: e.target.value });

  
  };

  const FormSubmit = async (e) => {
    e.preventDefault();

   
    

    setLoading(true); // Start loading

    try {
      const response = await loginUser(FormData);
      dispatch(loginInUser({ ...response.data }));
      toast.success("Login successful!");
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setLoading(false); // Stop loading after login process completes
    }
  };

  return (
    <>
      <NavBar />
      <div className="Login-Container">
        <div className="Login-Left-Part">
          <div className="Login-img"></div>
        </div>
        <div className="Login-Right-Part">
          <div className="Login-text">
            <div className="Login-text-head">Login to SuperStore</div>
            <div className="Login-text-para">Enter Your Details</div>
          </div>
          <form onSubmit={FormSubmit}>
            <input
              type="email"
              name="Email"
              onChange={FormDataHandler}
              placeholder="Email"
              required
            />
          
            <input
              type="password"
              name="Password"
              onChange={FormDataHandler}
              placeholder="Password"
              required
            />
         

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
                "Login"
              )}
            </button>
          </form>

          <div className="Signup-Right-Bottom">
            <div>
              Don't have an account? <Link to="/signup">Sign up here</Link>.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
