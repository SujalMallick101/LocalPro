import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  CalendarPlus,
  BookOpen,
  Star,
} from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
  { name: "Services", path: "/services", icon: <Briefcase className="w-5 h-5" /> },
  { name: "Book Service", path: "/book-service", icon: <CalendarPlus className="w-5 h-5" /> },
  { name: "My Bookings", path: "/bookings", icon: <BookOpen className="w-5 h-5" /> },
  { name: "My Reviews", path: "/reviews", icon: <Star className="w-5 h-5" /> },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="bg-base-100 w-60 min-h-screen p-4 shadow-lg border-r border-base-200">
      <ul className="menu space-y-1">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                location.pathname === item.path
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
