// src/components/FlightSearch.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
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
      <h3>Search Flights</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="From (e.g., NYC)"
                value={search.from}
                onChange={(e) => setSearch({ ...search, from: e.target.value })}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="To (e.g., LAX)"
                value={search.to}
                onChange={(e) => setSearch({ ...search, to: e.target.value })}
                required
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Control
                type="date"
                value={search.date}
                onChange={(e) => setSearch({ ...search, date: e.target.value })}
                required
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                min="1"
                placeholder="Passengers"
                value={search.passengers}
                onChange={(e) => setSearch({ ...search, passengers: e.target.value })}
                required
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Airline (e.g., Delta)"
                value={search.airline}
                onChange={(e) => setSearch({ ...search, airline: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" disabled={loading} className="w-100">
          {loading ? 'Searching...' : 'Search Flights'}
        </Button>
      </Form>
      {error && <div className="error">{error}</div>}
      {results.length > 0 && (
        <div>
          <div className="sort-options">
            <label>Sort by Price: </label>
            <Form.Select value={sortOrder} onChange={handleSortChange}>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </Form.Select>
          </div>
          <h4>Available Flights</h4>
          <div className="search-results">
            {results.map((flight) => (
              <Card key={flight.id} className="search-result-card mb-3">
                <Row className="g-0">
                  <Col md={3}>
                    <Card.Img
                      src="https://via.placeholder.com/150?text=Flight+Image"
                      alt="Flight"
                      className="result-image"
                    />
                  </Col>
                  <Col md={6}>
                    <Card.Body>
                      <Card.Title>{flight.airline}</Card.Title>
                      <Card.Text>
                        <strong>{flight.from} to {flight.to}</strong> on {flight.date}
                        <br />
                        Duration: {flight.duration}
                        <br />
                        Departure: {flight.departureTime} | Arrival: {flight.arrivalTime}
                      </Card.Text>
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} color={i < 4 ? '#ffc107' : '#e4e5e9'} />
                        ))}
                        <span>(4.0)</span>
                      </div>
                    </Card.Body>
                  </Col>
                  <Col md={3} className="d-flex align-items-center justify-content-center">
                    <div className="price-book">
                      <h5>${flight.price}</h5>
                      <Button variant="success" onClick={() => handleBookNow(flight)}>
                        Book Now
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightSearch;