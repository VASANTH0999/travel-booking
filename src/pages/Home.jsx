// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to Travel Booking</h1>
      <p>Book your flights, hotels, and car rentals all in one place!</p>
      <Link to="/booking">
        <button>Start Booking Now</button>
      </Link>
    </div>
  );
}

export default Home;