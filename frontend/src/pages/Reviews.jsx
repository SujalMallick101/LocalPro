import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Calendar, Star, MessageSquareText, User } from "lucide-react";

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "customer") return <Navigate to="/" />;

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const { data } = await API.get("/reviews/my");
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };

    fetchMyReviews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        <main className="flex-1 py-10 px-4">
          <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-box shadow">
            <h2 className="text-3xl font-bold text-primary mb-6">
              My Submitted Reviews
            </h2>

            {reviews.length === 0 ? (
              <p className="text-center text-gray-500">You haven't submitted any reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className="card bg-white shadow-md border border-base-300"
                  >
                    <div className="card-body space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-primary">
                          {r.bookingId?.subServiceName}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-bold">{r.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{r.providerId?.name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <MessageSquareText className="w-4 h-4 mt-1" />
                        <p>{r.comment}</p>
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

export default MyReviews;
