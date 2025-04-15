// src/pages/CarRentals.jsx
import { Link } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import CarRentalSearch from '../components/CarRentalSearch';
import '../styles/CarRentals.css';

function CarRentals() {
  return (
    <div className="car-rentals-page">
      <div className="banner">
        <FaCar className="banner-icon" />
        {/* Replace FaCar with <img src="your-car-image-url.jpg" alt="Car" className="banner-icon" /> if using an image */}
        <div className="banner-text">
          <h2>Embark on Your Journey</h2>
          <p>Uncover incredible car rentals with seamless bookings.</p>
        </div>
      </div>
      <nav className="breadcrumb">
        <Link to="/">Dashboard</Link> &gt; <span>Car Rentals</span>
      </nav>
      <div className="page-header">
        <FaCar className="page-icon" />
        <h1>Explore Car Rentals</h1>
      </div>
      <CarRentalSearch />
    </div>
  );
}

export default CarRentals;