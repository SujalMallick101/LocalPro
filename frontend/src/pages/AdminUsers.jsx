import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ShieldCheck, Mail, Phone, Ban, CheckCircle } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      await API.patch(`/admin/users/${id}/status`, {
        isBlocked: !currentStatus,
      });
      await fetchUsers();
    } catch (err) {
      alert("Failed to update user status.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-bold text-primary mb-6">Manage Users</h2>

          {users.length === 0 ? (
            <p className="text-gray-500 text-center">No users found.</p>
          ) : (
            <div className="space-y-4">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="card bg-white shadow border border-base-300 p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium">{u.name}</p>
                    <div className="text-sm text-gray-600 flex gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" /> {u.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" /> {u.phone || "N/A"}
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        <ShieldCheck className="w-4 h-4" /> {u.role}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`btn btn-sm ${
                      u.isBlocked ? "btn-success" : "btn-error"
                    }`}
                    disabled={loading}
                    onClick={() => toggleUserStatus(u._id, u.isBlocked)}
                  >
                    {u.isBlocked ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Unblock
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4" /> Block
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
