import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside className="bg-gray-100 w-60 p-4">
            <ul className="space-y-2">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/book-service">Book Service</Link></li>
                <li><Link to="/bookings">My Bookings</Link></li>
                <li><Link to="/reviews">My Reviews</Link></li>
            </ul>
        </aside>
    );
};

export default Sidebar;
