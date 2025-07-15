import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Star, Mail, UserCircle2 } from "lucide-react";

const ProviderProfile = () => {
  const { id } = useParams(); // providerId
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const userData = await API.get(`/users/${id}`);
        const reviewData = await API.get(`/reviews/${id}`);
        setProvider(userData.data);
        setReviews(reviewData.data.reviews);
        setAverageRating(reviewData.data.averageRating);
      } catch (err) {
        console.error("Failed to load provider profile", err);
      }
    };
    fetchProvider();
  }, [id]);

  if (!provider) return <p className="p-4">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 mt-6 bg-base-100 shadow rounded-box">
        <div className="flex items-center gap-3 mb-4">
          <UserCircle2 className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">{provider.name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Mail className="w-4 h-4" /> {provider.email}
            </p>
          </div>
        </div>

        <p className="text-lg font-medium flex items-center gap-1">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-600">{averageRating}/5</span> Average Rating
        </p>

        <hr className="my-4" />

        <h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="border rounded p-4 bg-white shadow">
                <p className="font-semibold text-sm text-gray-700">
                  {r.customerId?.name}
                </p>
                <p className="text-yellow-600 font-bold text-sm mb-1 flex items-center gap-1">
                  <Star className="w-4 h-4" /> {r.rating}/5
                </p>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProviderProfile;
