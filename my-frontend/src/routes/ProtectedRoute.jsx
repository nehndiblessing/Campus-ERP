import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};



export default ProtectedRoute;
