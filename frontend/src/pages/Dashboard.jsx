import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 shrink-0">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-base-100 rounded-xl p-6 shadow-md">
            <h1 className="text-3xl font-bold mb-2">Welcome to <span className="text-primary">LocalPro</span></h1>
            <p className="text-gray-600">
              Choose an action from the sidebar to get started.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;