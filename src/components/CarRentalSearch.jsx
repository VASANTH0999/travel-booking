// src/components/CarRentalSearch.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CarRentalSearch.css';

function CarRentalSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    location: '',
    pickupDate: '',
    returnDate: '',
    carType: '',
  });
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:5000/api/cars', {
        params: search,
      });
      let filteredResults = response.data;
      if (search.carType) {
        filteredResults = filteredResults.filter(
          (car) => car.type.toLowerCase() === search.carType.toLowerCase()
        );
      }
      setResults(filteredResults);
    } catch (error) {
      console.error('Error searching car rentals:', error);
    }
  };

  const handleBookNow = (car) => {
    navigate('/booking', { state: { item: car, type: 'car' } });
  };

  return (
    <div className="search-form">
      <h3>Car Rental Search</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Location"
          value={search.location}
          onChange={(e) => setSearch({ ...search, location: e.target.value })}
        />
        <input
          type="date"
          value={search.pickupDate}
          onChange={(e) => setSearch({ ...search, pickupDate: e.target.value })}
        />
        <input
          type="date"
          value={search.returnDate}
          onChange={(e) => setSearch({ ...search, returnDate: e.target.value })}
        />
        <input
          type="text"
          placeholder="Car Type (e.g., Economy)"
          value={search.carType}
          onChange={(e) => setSearch({ ...search, carType: e.target.value })}
        />
        <button type="submit">Search Car Rentals</button>
      </form>
      {results.length > 0 && (
        <div>
          <h4>Results:</h4>
          <ul className="search-results">
            {results.map((car) => (
              <li key={car.id} className="search-result-item">
                <div className="result-details">
                  <p>
                    <strong>{car.type}</strong> by {car.company} in {car.location}
                  </p>
                  <p>Price: ${car.price}/day</p>
                  <p>Features: {car.features.join(', ')}</p>
                </div>
                <button onClick={() => handleBookNow(car)}>Book Now</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CarRentalSearch;