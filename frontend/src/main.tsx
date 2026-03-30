import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Finance from "./pages/finance";
import Forecast from "./pages/forecast";
import Profile from "./pages/profile";

import ProtectedRoute from "./routes/protectedroute";

const AppRoutes = () => {
  const token = localStorage.getItem("access");

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/home" replace />}
        />

        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/home" replace />}
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <Finance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forecast"
          element={
            <ProtectedRoute>
              <Forecast />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);