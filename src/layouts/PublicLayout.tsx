import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicLayout() {
  const isAuthenticated = useSelector((state: any) => state.auth.isLoggedIn);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}