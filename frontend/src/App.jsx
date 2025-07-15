import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBooking from "./pages/MyBooking";
import PayBooking from "./pages/PayBooking";
import LeaveReview from "./pages/LeaveReview";
import ProviderProfile from "./pages/ProviderProfile";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />

        {/* Shared Auth Route (Dashboard) */}
        <Route element={<PrivateRoute allowedRoles={["customer", "provider", "admin"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Customer-Only Routes */}
        <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
          <Route path="/bookings" element={<MyBooking />} />
          <Route path="/pay/:id" element={<PayBooking />} />
          <Route path="/review/:id" element={<LeaveReview />} />
        </Route>

        {/* Provider-Only Routes */}
        <Route element={<PrivateRoute allowedRoles={["provider"]} />}>
          <Route path="/my-jobs" element={<MyBooking />} />
        </Route>

        {/* Admin Routes - placeholder */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
