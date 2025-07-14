import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        LocalPro
      </Link>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="capitalize">{user.role}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-white px-3 py-1 rounded hover:bg-white hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-white px-3 py-1 rounded hover:bg-white hover:text-blue-600 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
