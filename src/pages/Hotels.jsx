// src/pages/Hotels.jsx
import { Link } from 'react-router-dom';
import { FaHotel, FaSearch } from 'react-icons/fa';
import HotelSearch from '../components/HotelSearch';
import '../styles/Hotels.css';

function Hotels() {
  return (
    <div className="hotels-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Embark on Your Journey</h1>
          <p>Uncover incredible accommodations with seamless hotel bookings.</p>
          <div className="hero-animation">
            <FaHotel className="flying-hotel" />
          </div>
        </div>
      </section>


      <nav className="breadcrumb">
        <Link to="/">Dashboard</Link> &gt; <span>Hotels</span>
      </nav>


      <div className="page-header">
        <FaSearch className="search-icon" />
        <h2>Explore Hotels</h2>
      </div>

      <HotelSearch />
    </div>
  );
}

export default Hotels;