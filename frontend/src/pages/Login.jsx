import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login({ ...data.user, token: data.token });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-base-100 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Login to LocalPro</h2>

        {error && (
          <div className="alert alert-error mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </span>
            </div>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Password */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
