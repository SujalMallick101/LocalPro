import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold">Welcome to LocalPro</h1>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
