import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  CalendarPlus,
  BookOpen,
  Star,
  LayoutDashboard,
  Users,
  Wrench,
  ClipboardList,
  UserCheck,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  // Dynamically set home path based on role
  const homePath =
    user.role === "admin"
      ? "/admin/dashboard"
      : user.role === "provider"
        ? "/provider/dashboard"
        : "/dashboard";

  const common = [
    { name: "Home", path: homePath, icon: <Home className="w-5 h-5" /> },
  ];

  const customerNav = [
    { name: "Book Service", path: "/book-service", icon: <CalendarPlus className="w-5 h-5" /> },
    { name: "My Bookings", path: "/bookings", icon: <BookOpen className="w-5 h-5" /> },
    { name: "My Reviews", path: "/reviews", icon: <Star className="w-5 h-5" /> },
  ];

  const providerNav = [
    { name: "Add Service", path: "/provider/add-service", icon: <PlusCircle className="w-5 h-5" /> },
    { name: "My Jobs", path: "/my-jobs", icon: <ClipboardList className="w-5 h-5" /> },
    { name: "Reviews", path: "/provider/reviews", icon: <Star className="w-5 h-5" /> },
  ];

  const adminNav = [
    { name: "Manage Users", path: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { name: "Manage Services", path: "/admin/services", icon: <Wrench className="w-5 h-5" /> },
  ];

  const profile = [
    { name: "Profile", path: "/profile", icon: <UserCheck className="w-5 h-5" /> },
  ];

  const logoutItem = [
    {
      name: "Logout",
      icon: <LogOut className="w-5 h-5" />,
      action: logout,
    },
  ];

  let roleNav = [];

  if (user.role === "customer") {
    roleNav = [...common, ...customerNav, ...profile, ...logoutItem];
  } else if (user.role === "provider") {
    roleNav = [...common, ...providerNav, ...profile, ...logoutItem];
  } else if (user.role === "admin") {
    roleNav = [...common, ...adminNav, ...profile, ...logoutItem];
  }

  return (
    <aside className="w-full h-full p-4 space-y-1">
      <ul className="menu space-y-1">
        {roleNav.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              onClick={item.action}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${location.pathname === item.path
                ? "bg-primary text-white font-semibold"
                : "hover:bg-base-200"
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
