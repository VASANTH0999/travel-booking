// src/components/Dashboard.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Added useEffect for initial state
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <h1>Travel Booking Dashboard</h1>
      <div className="auth-status">
        {isLoggedIn ? (
          <>
            <p>Welcome back! Ready to plan your next trip?</p>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <p>
            Please <Link to="/login">login</Link> to access your travel booking options.
          </p>
        )}
      </div>
      {isLoggedIn && (
        <div className="dashboard-links">
          <Link to="/flights" className="dashboard-link">
            <div className="dashboard-card">
              <h3>Flights</h3>
              <p>Search and book flights to your destination.</p>
            </div>
          </Link>
          <Link to="/hotels" className="dashboard-link">
            <div className="dashboard-card">
              <h3>Hotels</h3>
              <p>Find and book hotels for your stay.</p>
            </div>
          </Link>
          <Link to="/car-rentals" className="dashboard-link">
            <div className="dashboard-card">
              <h3>Car Rentals</h3>
              <p>Rent a car for your trip.</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;