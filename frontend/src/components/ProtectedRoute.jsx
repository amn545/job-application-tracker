import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Ye component kisi bhi page ko "wrap" karke use protected bana deta hai —
// agar user login nahi hai, to seedha /login pe bhej dega.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
