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
        const { data } = await API.get("/users/me");
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile");
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
      const { data } = await API.put("/users/me", {
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
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      {/* Sidebar + Main */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar (hidden on mobile) */}
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-primary mb-4">My Profile</h2>

          {error && <div className="alert alert-error mb-4">{error}</div>}
          {success && <div className="alert alert-success mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
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
              <input type="email" value={profile.email} disabled className="grow" />
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
              <input type="text" value={profile.role} disabled className="grow capitalize" />
            </label>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Profile;
