import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import BookService from "./pages/BookService";
import MyBooking from "./pages/MyBooking";
import Dashboard from "./pages/Dashboard"; // ✅ This is for '/'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Dashboard />} />

      {/* Protected routes with layout (Navbar + Sidebar) */}
      <Route element={<Layout />}>
        <Route path="/services" element={<Services />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/bookings" element={<MyBooking />} />
      </Route>

      {/* 404 fallback (optional) */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
