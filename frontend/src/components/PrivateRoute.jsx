import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // If user is not logged in, redirect to landing page (better UX than login page)
  if (!user) return <Navigate to="/" replace />;

  // If user doesn't have the right role, redirect them to their correct dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRedirects = {
      customer: "/dashboard",
      provider: "/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={roleRedirects[user.role] || "/"} replace />;
  }

  // If all checks pass, render the nested route
  return <Outlet />;
};

export default PrivateRoute;
