// src/pages/Hotels.jsx
import { Link } from 'react-router-dom';
import { FaHotel } from 'react-icons/fa';
import HotelSearch from '../components/HotelSearch';
import '../styles/Hotels.css';

function Hotels() {
  return (
    <div className="hotels-page">
     <nav className="breadcrumb">
        <Link to="/">Dashboard</Link> &gt; <span>Hotels</span>
      </nav>
<div className="page-header">
        <FaHotel className="page-icon" />
        <h1>Hotel Search</h1>
      </div>
      <HotelSearch />
    </div>
  );
}

export default Hotels;