import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import "../css/Login.css";
import { toast } from "react-toastify";
import Footer from "../Components/Footer";
import SmallLoader from "../Components/Common/SmallLoader";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { sendForgotPasswordEmail } from "../util/queries"; // API call for sending the reset email

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading,setLoading]=useState(false);
  const navigate=useNavigate();

  const { mutate } = useMutation( {
    mutationFn:sendForgotPasswordEmail,
    onSuccess: () => {
      toast.success("A reset link has been sent to your email address.");
      navigate('/')
      
    },
    onError: (error) => {
        // console.log("error",error)
      toast.error(String(error) || "Failed to send reset email.");
      setLoading(false)
    },
  });

  useEffect(() => {
    document.title = "Forgot Password";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)

    if (!email) {
      toast.error("Please enter your email address");
      setLoading(false)
      return;
    }

    mutate({ email });
  };

  return (
    <>
      <NavBar />
      <div className="Login-Container">
        <div
          className="Login-Right-Part"
          style={{
            boxShadow: "0px 0px 13px 2px rgba(0, 0, 0, 0.055)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <div
              className="Login-text-head"
              style={{
                fontSize: "1.4rem",
                fontWeight: 500,
                letterSpacing: "2px",
              }}
            >
              Forgot Password
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="Login-text-para">Enter your email address</div>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? (
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
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="Signup-Right-Bottom">
            <div>
              Remembered your password? <Link to="/Login">Login here</Link>.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
