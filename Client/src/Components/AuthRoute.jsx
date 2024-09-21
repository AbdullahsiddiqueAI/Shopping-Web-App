import React from 'react';
import { useSelector } from 'react-redux'; // To access the Redux store for authentication state
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ component: Component }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get authentication status from Redux

  // If the user is not authenticated, redirect to the login page
  return !isAuthenticated ? <Component /> : <Navigate to="/" replace/>;
};

export default AuthRoute;
