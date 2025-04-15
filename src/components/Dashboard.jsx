// src/pages/Dashboard.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { FaPlane, FaHotel, FaCar } from 'react-icons/fa';

function Dashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setTimeout(() => {
      setIsLoggedIn(loggedIn);
      setIsLoading(false);
    }, 500); 
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    console.log('User logged out');
    navigate('/login');
  };

  if (isLoading) {
    return <div className="loading">Loading your journey...</div>;
  }

  return (
    <div className="dashboard">
      <div className="hero-section">
        <h1>Plan Your Dream Journey</h1>
        <p>Discover flights, hotels, and cars tailored for you.</p>
      </div>
      <div className="auth-status">
        {isLoggedIn ? (
          <>
            <p>Hello, Explorer! Ready for your next getaway?</p>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <p>
            <Link to="/login">Log in</Link> to unlock your travel options.
          </p>
        )}
      </div>
      {isLoggedIn && (
        <div className="dashboard-links">
          <Link to="/flights" className="dashboard-link">
            <div className="dashboard-card flights-card">
              <FaPlane className="card-icon" />
              <h3>Flights</h3>
              <p>Fly to your favorite destinations.</p>
            </div>
          </Link>
          <Link to="/hotels" className="dashboard-link">
            <div className="dashboard-card hotels-card">
              <FaHotel className="card-icon" />
              <h3>Hotels</h3>
              <p>Stay in comfort, wherever you go.</p>
            </div>
          </Link>
          <Link to="/car-rentals" className="dashboard-link">
            <div className="dashboard-card car-rentals-card">
              <FaCar className="card-icon" />
              <h3>Car Rentals</h3>
              <p>Hit the road with ease.</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;