import { Link } from 'react-router-dom';
import { FaPlane, FaSearch } from 'react-icons/fa';
import FlightSearch from '../components/FlightSearch';
import '../styles/Flights.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Flights() {
  return (
    <div className="flights-page">
    
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Search and book flights to your dream destinations effortlessly.</p>
          <div className="hero-animation">
            <FaPlane className="plane-animation" />
          </div>
        </div>
      </section>

    
      <nav className="breadcrumb">
        <Link to="/">Dashboard</Link> &gt; <span>Flights</span>
      </nav>

     
      <div className="page-header">
        <FaSearch className="page-icon" />
        <h2>Explore Flights</h2>
      </div>

      
      <FlightSearch />
    </div>
  );
}

export default Flights;