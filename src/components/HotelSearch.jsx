import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/HotelSearch.css';

function HotelSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    minRating: '',
  });
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:5000/api/hotels', {
        params: search,
      });
      let filteredResults = response.data;
      if (search.minRating) {
        filteredResults = filteredResults.filter(
          (hotel) => hotel.rating >= parseFloat(search.minRating)
        );
      }
      setResults(filteredResults);
    } catch (error) {
      console.error('Error searching hotels:', error);
    }
  };

  const handleBookNow = (hotel) => {
    navigate('/booking', { state: { item: hotel, type: 'hotel' } });
  };

  return (
    <div className="search-form">
      <h3>Hotel Search</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Destination"
          value={search.destination}
          onChange={(e) => setSearch({ ...search, destination: e.target.value })}
        />
        <input
          type="date"
          value={search.checkIn}
          onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
        />
        <input
          type="date"
          value={search.checkOut}
          onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
        />
        <input
          type="number"
          min="1"
          placeholder="Guests"
          value={search.guests}
          onChange={(e) => setSearch({ ...search, guests: e.target.value })}
        />
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="Min Rating (e.g., 4.0)"
          value={search.minRating}
          onChange={(e) => setSearch({ ...search, minRating: e.target.value })}
        />
        <button type="submit">Search Hotels</button>
      </form>
      {results.length > 0 && (
        <div>
          <h4>Results:</h4>
          <ul className="search-results">
            {results.map((hotel) => (
              <li key={hotel.id} className="search-result-item">
                <div className="result-details">
                  <p>
                    <strong>{hotel.name}</strong> in {hotel.location}
                  </p>
                  <p>Price: ${hotel.price}/night</p>
                  <p>Rating: {hotel.rating}/5</p>
                  <p>
                    Amenities:{' '}
                    {Array.isArray(hotel.amenities)
                      ? hotel.amenities.join(', ')
                      : JSON.parse(hotel.amenities).join(', ')}
                  </p>
                </div>
                <button onClick={() => handleBookNow(hotel)}>Book Now</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HotelSearch;