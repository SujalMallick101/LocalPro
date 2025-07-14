import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: visible on md+ devices only */}
        <aside className="hidden md:block w-64 bg-base-200 border-r shadow-md">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
