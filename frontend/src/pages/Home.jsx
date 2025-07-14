import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Lucide Icons
import { Wrench, ShieldCheck, UserPlus, Search } from "lucide-react";
import Navbar from "../components/Navbar";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="bg-base-200 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        {/* Hero Section */}
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Welcome to LocalPro
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Your trusted platform to find and book local service professionals—from electricians to cleaners—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <>
                {user.role === "customer" && (
                  <Link to="/services" className="btn btn-primary btn-lg gap-2">
                    <Search className="w-5 h-5" />
                    Browse Services
                  </Link>
                )}
                {user.role === "provider" && (
                  <Link to="/my-bookings" className="btn btn-primary btn-lg gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    View Assigned Bookings
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/dashboard" className="btn btn-primary btn-lg gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Admin Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg gap-2">
                  <UserPlus className="w-5 h-5" />
                  Get Started
                </Link>
                <Link to="/services" className="btn btn-outline btn-lg gap-2">
                  <Search className="w-5 h-5" />
                  Explore Services
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
          <div className="card bg-base-100 shadow-md p-6 text-center">
            <Wrench className="mx-auto text-primary w-10 h-10 mb-3" />
            <h3 className="font-bold text-lg">Skilled Professionals</h3>
            <p className="text-sm text-gray-600">
              Verified and experienced providers ready to help with your needs.
            </p>
          </div>

          <div className="card bg-base-100 shadow-md p-6 text-center">
            <ShieldCheck className="mx-auto text-primary w-10 h-10 mb-3" />
            <h3 className="font-bold text-lg">Secure & Reliable</h3>
            <p className="text-sm text-gray-600">
              Safe payments and reliable service you can trust.
            </p>
          </div>

          <div className="card bg-base-100 shadow-md p-6 text-center">
            <Search className="mx-auto text-primary w-10 h-10 mb-3" />
            <h3 className="font-bold text-lg">Easy Booking</h3>
            <p className="text-sm text-gray-600">
              Book services in just a few clicks. Fast and hassle-free.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
