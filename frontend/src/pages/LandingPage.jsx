import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { LogIn, UserPlus, SearchCheck } from "lucide-react";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="max-w-4xl text-center space-y-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Welcome to <span className="text-accent">LocalPro</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book trusted local service providers near you — from electricians to beauticians.
            Safe, verified, and easy.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
            <Link to="/login" className="btn btn-primary btn-lg flex items-center gap-2">
              <LogIn className="w-5 h-5" /> Login
            </Link>
            <Link to="/register" className="btn btn-outline btn-accent btn-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Get Started
            </Link>
            <Link to="/provider/preview-id" className="btn btn-outline btn-info btn-lg flex items-center gap-2">
              <SearchCheck className="w-5 h-5" /> Explore Providers
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
