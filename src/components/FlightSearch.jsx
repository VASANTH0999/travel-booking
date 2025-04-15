import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaStar, FaSpinner, FaSearch } from 'react-icons/fa';
import '../styles/FlightSearch.css';

function FlightSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    airline: '',
  });
  const [results, setResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/flights', {
        params: search,
      });
      let filteredResults = response.data;
      if (search.airline) {
        filteredResults = filteredResults.filter((flight) => {
          if (!flight.airline) {
            console.warn('Flight object missing airline property:', flight);
            return false;
          }
          return flight.airline.toLowerCase().trim() === search.airline.toLowerCase().trim();
        });
      }
      if (filteredResults.length === 0) {
        setError('No flights found for the given criteria.');
      }
      filteredResults.sort((a, b) =>
        sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
      setResults(filteredResults);
    } catch (error) {
      let errorMessage = 'An error occurred while searching for flights.';
      if (error.message.includes('Network Error')) {
        errorMessage = 'Unable to connect to the server. Please ensure the backend server is running.';
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.data.error || error.response.statusText}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    setResults((prevResults) =>
      [...prevResults].sort((a, b) =>
        newSortOrder === 'asc' ? a.price - b.price : b.price - a.price
      )
    );
  };

  const handleBookNow = (flight) => {
    navigate('/booking', { state: { item: flight, type: 'flight' } });
  };

  return (
    <div className="search-form">
      <Card className="search-card">
        <Card.Body>
          <h3 className="search-title">Embark on Your Journey</h3>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3 align-items-end">
              <Col md={3} sm={6}>
                <Form.Group>
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., NYC"
                    value={search.from}
                    onChange={(e) => setSearch({ ...search, from: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3} sm={6}>
                <Form.Group>
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., LAX"
                    value={search.to}
                    onChange={(e) => setSearch({ ...search, to: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2} sm={6}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={search.date}
                    onChange={(e) => setSearch({ ...search, date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2} sm={6}>
                <Form.Group>
                  <Form.Label>Passengers</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="e.g., 1"
                    value={search.passengers}
                    onChange={(e) => setSearch({ ...search, passengers: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2} sm={6}>
                <Form.Group>
                  <Form.Label>Airline</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Delta"
                    value={search.airline}
                    onChange={(e) => setSearch({ ...search, airline: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="text-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="search-button"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spin" /> Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch /> Search Flights
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
          {error && <div className="error-message">{error}</div>}
          {results.length > 0 && (
            <div className="results-container">
              <div className="sort-options">
                <label>Sort by Price:</label>
                <Form.Select value={sortOrder} onChange={handleSortChange}>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </Form.Select>
              </div>
              <h4 className="results-title">Explore Your Options</h4>
              <div className="results-grid">
                {results.map((flight) => (
                  <Card key={flight.id} className="flight-card">
                    <Card.Img
                      variant="top"
                      src={flight.image || "https://via.placeholder.com/300x150?text=Flight"}
                      alt={`${flight.airline} flight`}
                    />
                    <Card.Body>
                      <Card.Title>{flight.airline}</Card.Title>
                      <Card.Text>
                        <strong>{flight.from_city} to {flight.to_city}</strong><br />
                        Date: {flight.date}<br />
                        Duration: {flight.duration}<br />
                        Departure: {flight.departure_time} | Arrival: {flight.arrival_time}
                      </Card.Text>
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < (flight.rating || 4) ? '#ffd700' : '#d3d3d3'}
                          />
                        ))}
                        <span>({flight.rating || 4.0})</span>
                      </div>
                      <div className="price-book">
                        <h5>${flight.price}</h5>
                        <Button
                          variant="success"
                          onClick={() => handleBookNow(flight)}
                          className="book-button"
                        >
                          Book Now
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default FlightSearch;