import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { User, Mail, Phone, ShieldCheck } from "lucide-react";

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await API.put("/auth/me", {
        name: profile.name,
        phone: profile.phone,
      });
      setProfile(data);
      login({ ...user, name: data.name, phone: data.phone }); // update context
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      {/* Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 py-10 px-4">
          <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-box shadow">
            <h2 className="text-3xl font-bold text-primary mb-1">
              My Profile
            </h2>
            <p className="text-gray-600 mb-6">
              Logged in as a{" "}
              <span className="capitalize font-medium">{user?.role}</span>
            </p>

            {error && <div className="alert alert-error mb-4">{error}</div>}
            {success && (
              <div className="alert alert-success mb-4">{success}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <label className="input input-bordered flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="grow"
                  required
                />
              </label>

              {/* Email (read-only) */}
              <label className="input input-disabled flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="grow"
                />
              </label>

              {/* Phone */}
              <label className="input input-bordered flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="grow"
                />
              </label>

              {/* Role (read-only) */}
              <label className="input input-disabled flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="grow capitalize"
                />
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
