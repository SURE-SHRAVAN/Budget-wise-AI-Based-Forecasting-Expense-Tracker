import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import { AuthProvider } from "../context/authcontext";
import ProtectedRoute from "../routes/protectedroute";
import Analytics from "../pages/analytics";
import Assistant from "../pages/assistant";
import Dashboard from "../pages/dashboard";
import Finance from "../pages/finance";
import Forecast from "../pages/forecast";
import Goals from "../pages/goals";
import Home from "../pages/home";
import Login from "../pages/login";
import NotFound from "../pages/notfound";
import Profile from "../pages/profile";
import Register from "../pages/register";
import Settings from "../pages/settings";
import Transactions from "../pages/transactions";

export const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/home" element={<Navigate replace to="/" />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ErrorBoundary>
);
