import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth';

function GuestRoute({ children, redirectTo = '/' }) {
  if (isLoggedIn()) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}

export default GuestRoute;
