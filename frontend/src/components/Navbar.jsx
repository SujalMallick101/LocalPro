import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { LogOut, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 shadow-md px-6 sticky top-0 z-50">
      {/* Brand */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary">
          LocalPro
        </Link>
      </div>

      {/* Right side */}
      <div className="flex-none flex items-center gap-4">
        {user ? (
          <>
            <span className="badge badge-outline capitalize">{user.role}</span>
            <button
              onClick={logout}
              className="btn btn-sm btn-error flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="btn btn-sm flex items-center gap-1 border border-primary text-primary hover:bg-primary hover:text-white"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-sm flex items-center gap-1 border border-primary text-primary hover:bg-primary hover:text-white"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
