import { Navigate, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/authcontext";

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border border-white/20 border-t-white" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
