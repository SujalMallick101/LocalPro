import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const LeaveReview = () => {
  const { id } = useParams(); // bookingId
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await API.get("/bookings/my");
        const match = data.find((b) => b._id === id);
        if (match && match.status === "completed" && match.paymentStatus === "paid" && !match.reviewGiven) {
          setBooking(match);
        } else {
          navigate("/bookings");
        }
      } catch (err) {
        console.error(err);
        navigate("/bookings");
      }
    };
    fetchBooking();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", {
        bookingId: id,
        rating,
        comment,
      });
      alert("Review submitted!");
      navigate("/bookings");
    } catch (err) {
      alert("Failed to submit review.");
      console.error(err);
    }
  };

  if (!booking) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center bg-base-200 px-4">
        <div className="max-w-md w-full bg-base-100 p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-center text-primary">
            Leave a Review
          </h2>
          <p className="mb-2 text-gray-700">
            <strong>Service:</strong> {booking.subServiceName}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Rating (1–5)</span>
              <select
                className="select select-bordered w-full"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              >
                {[5, 4, 3, 2, 1].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Comment</span>
              <textarea
                className="textarea textarea-bordered w-full"
                rows="4"
                placeholder="Write your feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>

            <button type="submit" className="btn btn-primary w-full">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LeaveReview;
