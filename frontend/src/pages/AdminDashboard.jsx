import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { Users, Settings } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchServices();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await API.get("/services");
      setServices(data);
    } catch (err) {
      console.error("Error fetching services", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 p-6">
        <h1 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6" /> Admin Dashboard
        </h1>

        {/* User Management */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Users className="w-5 h-5" /> All Users
          </h2>
          <div className="overflow-x-auto bg-base-100 rounded-box shadow">
            <table className="table">
              <thead>
                <tr className="bg-base-300">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover">
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td className="capitalize">
                      <span className="badge badge-outline">
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Management */}
        <div>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Settings className="w-5 h-5" /> All Services
          </h2>
          <div className="overflow-x-auto bg-base-100 rounded-box shadow">
            <table className="table">
              <thead>
                <tr className="bg-base-300">
                  <th>Service</th>
                  <th>Sub-services</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id} className="hover">
                    <td className="font-medium text-primary">{s.name}</td>
                    <td>
                      <ul className="list-disc pl-4 text-sm">
                        {s.subServices.map((sub, i) => (
                          <li key={i}>
                            {sub.name} - ₹{sub.price} ({sub.duration})
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;