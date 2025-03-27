// src/pages/Flights.jsx
import { Link } from 'react-router-dom';
import { FaPlane } from 'react-icons/fa';
import FlightSearch from '../components/FlightSearch';
import '../styles/Flights.css';

function Flights() {
  return (
    <div className="flights-page">
      <nav className="breadcrumb">
        <Link to="/">Dashboard</Link> &gt; <span>Flights</span>
      </nav>
      <div className="page-header">
        <FaPlane className="page-icon" />
        <h1>Flight Search</h1>
      </div>
      <FlightSearch />
    </div>
  );
}

export default Flights;