import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

// Lucide Icons
import { User, Mail, Phone, Lock, UserRoundCheck } from "lucide-react";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      const { data } = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      login({ ...data.user, token: data.token });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-primary mb-4">
            Register
          </h2>

          {error && (
            <div className="alert alert-error text-sm py-2 mb-3">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <label className="input input-bordered flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="grow"
                onChange={handleChange}
                required
              />
            </label>

            {/* Email */}
            <label className="input input-bordered flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="grow"
                onChange={handleChange}
                required
              />
            </label>

            {/* Phone */}
            <label className="input input-bordered flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="grow"
                onChange={handleChange}
                required
              />
            </label>

            {/* Password */}
            <label className="input input-bordered flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="grow"
                onChange={handleChange}
                required
              />
            </label>

            {/* Role */}
            <label className="input input-bordered flex items-center gap-2">
              <UserRoundCheck className="w-4 h-4 text-gray-500" />
              <select
                name="role"
                className="select w-full border-none bg-transparent focus:outline-none text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="provider">Provider</option>
              </select>
            </label>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
