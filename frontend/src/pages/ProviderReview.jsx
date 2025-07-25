import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Star, User, Calendar, Quote } from "lucide-react";

const ProviderReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    console.log("User object in ProviderReviews:", user);
    const fetchReviews = async () => {
      try {
        // ✅ FIXED: use backticks to correctly interpolate user._id
        const { data } = await API.get(`/reviews/provider/${user.id}`);
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    if (user?.role === "provider" && user?.id) {
      fetchReviews();
    }
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

        {/* Main Content */}
        <main className="flex-1 py-10 px-4">
          <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-box shadow">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Reviews from Customers
            </h2>

            <p className="text-gray-500 mb-6">
              ⭐ Average Rating:{" "}
              <strong>{averageRating || "N/A"}</strong> ({totalReviews} reviews)
            </p>

            {reviews.length === 0 ? (
              <p className="text-center text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className="card bg-white shadow-md border border-base-300"
                  >
                    <div className="card-body space-y-2">
                      {/* Rating */}
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4" fill="currentColor" />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {r.rating}/5
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="flex items-start gap-2 text-sm text-gray-700 mt-2">
                        <Quote className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="italic">"{r.comment}"</p>
                      </div>

                      {/* Customer Name */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>From: {r.customerId?.name || "N/A"}</span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
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
