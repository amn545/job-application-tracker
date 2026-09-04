import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">JobTracker</Link>
      {user && (
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-slate-300">Dashboard</Link>
          <Link to="/applications" className="hover:text-slate-300">Applications</Link>
          <span className="text-slate-400 text-sm">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
