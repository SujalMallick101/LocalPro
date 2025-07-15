import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBooking from "./pages/MyBooking";
import PayBooking from "./pages/PayBooking";
import LeaveReview from "./pages/LeaveReview";
import ProviderProfile from "./pages/ProviderProfile";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookService from "./pages/BookService";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/provider/:id" element={<ProviderProfile />} />

      {/* Customer Dashboard */}
      <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/bookings" element={<MyBooking />} />
        <Route path="/pay/:id" element={<PayBooking />} />
        <Route path="/review/:id" element={<LeaveReview />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Provider Dashboard */}
      <Route element={<PrivateRoute allowedRoles={["provider"]} />}>
        <Route path="/dashboard" element={<ProviderDashboard />} />
        <Route path="/my-jobs" element={<MyBooking />} />
      </Route>

      {/* Admin Dashboard */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
