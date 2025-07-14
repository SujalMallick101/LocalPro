import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { useNavigate,Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const BookService = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

   if (!user) return <Navigate to="/login" />;
  if (user.role !== "customer") return <Navigate to="/" />;

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [subServices, setSubServices] = useState([]);
  const [selectedSubService, setSelectedSubService] = useState("");

  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await API.get("/services");
      setServices(data);
    };

    const fetchProviders = async () => {
      const { data } = await API.get("/users?role=provider"); // You can create a route to get only providers
      setProviders(data);
    };

    fetchServices();
    fetchProviders();
  }, []);

  const handleServiceSelect = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    setSelectedService(serviceId);
    setSubServices(service?.subServices || []);
    setSelectedSubService("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      providerId,
      serviceId: selectedService,
      subServiceName: selectedSubService,
      scheduledDate,
      scheduledTime,
      address,
    };

    try {
      await API.post("/bookings", payload);
      alert("Booking created!");
      navigate("/bookings");
    } catch (err) {
      console.error(err);
      alert("Failed to book service");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Book a Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service */}
        <select
          required
          className="w-full border p-2 rounded"
          onChange={(e) => handleServiceSelect(e.target.value)}
        >
          <option value="">Select Service</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Sub-service */}
        <select
          required
          className="w-full border p-2 rounded"
          onChange={(e) => setSelectedSubService(e.target.value)}
          value={selectedSubService}
        >
          <option value="">Select Sub-service</option>
          {subServices.map((sub, i) => (
            <option key={i} value={sub.name}>
              {sub.name} - ₹{sub.price} ({sub.duration})
            </option>
          ))}
        </select>

        {/* Provider */}
        <select
          required
          className="w-full border p-2 rounded"
          onChange={(e) => setProviderId(e.target.value)}
        >
          <option value="">Select Provider</option>
          {providers.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.email})
            </option>
          ))}
        </select>

        {/* Date and Time */}
        <input
          type="date"
          required
          className="w-full border p-2 rounded"
          onChange={(e) => setScheduledDate(e.target.value)}
        />
        <input
          type="time"
          required
          className="w-full border p-2 rounded"
          onChange={(e) => setScheduledTime(e.target.value)}
        />

        {/* Address */}
        <input
          type="text"
          placeholder="Street"
          className="w-full border p-2 rounded"
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          className="w-full border p-2 rounded"
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="State"
          className="w-full border p-2 rounded"
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />
        <input
          type="text"
          placeholder="Pincode"
          className="w-full border p-2 rounded"
          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookService;
