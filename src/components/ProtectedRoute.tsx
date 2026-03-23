import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  // Updated to include super_admin to match App.tsx requirements
  requiredRole?: "admin" | "student" | "super_admin";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();

  // 1. Show a loading spinner while checking the session
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. If no user is logged in, send them to the Auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 3. Role-based Authorization Logic
  if (requiredRole) {
    // A Super Admin can access everything (Admin and Super Admin pages)
    if (role === "super_admin") {
      return <>{children}</>;
    }

    // If the user's role doesn't match the required role, redirect to home
    if (role !== requiredRole) {
      console.warn(`Access denied. Required: ${requiredRole}, Current: ${role}`);
      return <Navigate to="/" replace />;
    }
  }

  // 4. If all checks pass, render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;