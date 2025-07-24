import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  Star,
  User,
  Calendar,
  ClipboardList,
  Quote,
} from "lucide-react";

const ProviderReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await API.get("/reviews/provider");
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    if (user?.role === "provider") fetchReviews();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      {/* Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        {/* Main */}
        <main className="flex-1 py-10 px-4">
          <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-box shadow">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Reviews from Customers
            </h2>

            {reviews.length === 0 ? (
              <p className="text-center text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((b) => (
                  <div
                    key={b._id}
                    className="card bg-white shadow-md border border-base-300"
                  >
                    <div className="card-body space-y-2">
                      {/* Title */}
                      <div className="flex justify-between items-center">
                        <h3 className="card-title text-lg text-primary">
                          {b.serviceId?.name} - {b.subServiceName}
                        </h3>
                        <div className="badge badge-outline badge-success capitalize">
                          {b.status}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(b.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Customer Name */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Customer: {b.customerId?.name || "N/A"}</span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1 text-yellow-500">
                        {[...Array(b.review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4" fill="currentColor" />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {b.review.rating}/5
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="flex items-start gap-2 text-sm text-gray-700 mt-2">
                        <Quote className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="italic">"{b.review.comment}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProviderReviews;
