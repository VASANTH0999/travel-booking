// src/pages/CarRentals.jsx
import { Link } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import CarRentalSearch from '../components/CarRentalSearch';
import '../styles/CarRentals.css';

function CarRentals() {
  return (
    <div className="car-rentals-page">
      <nav className="breadcrumb">
        <Link to="/">Dashboard</Link> &gt; <span>Car Rentals</span>
      </nav>
      <div className="page-header">
        <FaCar className="page-icon" />
        <h1>Car Rental Search</h1>
      </div>
      <CarRentalSearch />
    </div>
  );
}

export default CarRentals;