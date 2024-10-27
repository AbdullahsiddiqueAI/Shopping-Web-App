import React from 'react';
import { useSelector } from 'react-redux'; // To access the Redux store for authentication state
import { Navigate } from 'react-router-dom';

const AuthAdmin = ({ component: Component }) => {
  const {isAuthenticated,isAdmin} = useSelector((state) => state.auth); // Get authentication status from Redux

  // If the user is not authenticated, redirect to the login page
  return isAuthenticated && isAdmin ? <Component /> : <Navigate to="/" replace/>;
};

export default AuthAdmin;