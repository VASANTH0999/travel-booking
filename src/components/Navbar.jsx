// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Travel Booking</Link>
      <div>
        <Link to="/">Home</Link>
        <Link to="/booking">Book Now</Link>
      </div>
    </nav>
  );
}

export default Navbar;