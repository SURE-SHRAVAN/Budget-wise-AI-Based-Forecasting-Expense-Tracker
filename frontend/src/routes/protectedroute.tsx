import { Navigate } from "react-router-dom";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("access");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists → allow access
  return <>{children}</>;
};

export default ProtectedRoute;