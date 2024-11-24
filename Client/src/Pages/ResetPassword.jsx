import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import "../css/Login.css";
import { toast } from "react-toastify";
import { resetPassword, validateResetLink } from "../util/queries"; // API call for resetting password
import SmallLoader from "../Components/Common/SmallLoader";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../Components/Common/Loader";

const ResetPassword = () => {
  const [searchParams] = useSearchParams(); // Get the token from the URL
  const token=searchParams.get('token')
  const email=searchParams.get('email')
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [LoadingNull, setNullLoading] = useState(true)
  const { data, isLoading:validateLoading, isError,isSuccess } = useQuery({
    queryKey:["validateResetLink", token, email],
    queryFn:() => validateResetLink({ token, email }),
   
    enabled: !!token && !!email, 
    retry: false,
    }
  );
  useEffect(()=>{
    if(isError){

      toast.error("Not a Valid Reset Password Link.");
      navigate('/ForgotPassword')
    }

  },[data,isError,validateLoading])
  useEffect(()=>{
    if(isSuccess){

      setNullLoading(false)
    }
  },[data,isSuccess,validateLoading])
  

  useEffect(() => {
    document.title = "Reset Password";
  }, []);
  const { mutate } = useMutation( {
    mutationFn:resetPassword,
    onSuccess: () => {
      toast.success("Password Updated Successfully");
      navigate('/Login')
      
    },
    onError: (error) => {
        // console.log("error",error)
      toast.error(String(error) || "Failed to send reset email.");
      setLoading(false)
    },
  });
  useEffect(()=>{

      if(!token&&!email){
        toast.error("Not a Valid Reset Password Link.");
        navigate('/ForgotPassword')
        return
      }
    
  },[])
  if(LoadingNull){
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100vw',height:'100vh'}}>
        <Loader />
    </div> 
  }
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      toast.error("Both password fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    mutate({email,password,token})
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
              Reset Password
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="Login-text-para">Enter your new password</div>
            <input
              type="password"
              name="password"
              onChange={handleInputChange}
              placeholder="New Password"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              onChange={handleInputChange}
              placeholder="Confirm Password"
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
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;
